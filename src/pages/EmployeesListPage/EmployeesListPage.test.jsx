import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';

import { Routes, Route, MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from '../../store/employeeSlice';
import AddEmployeesPage from '../AddEmployeesPage/AddEmployeesPage';
import EmployeesListPage from '../EmployeesListPage/EmployeesListPage';
import Layout from '../../components/Layout';

import { beforeEach, afterEach, expect, describe, it } from 'vitest';

const createTestStore = (preloadedState = {}) => {
    return configureStore({
        reducer: {
            employees: employeeReducer,
            },
        preloadedState: {
            employees: {
                employee: []
            },
            ...preloadedState
        }
    });
}

const renderEmployeesListPage = (store = createTestStore(), initialRoute = '/employees-list') => {
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[initialRoute]}>
                <Routes>
                    <Route path="/" element={<Layout />} >
                        <Route index element={<AddEmployeesPage />} />
                        <Route path="employees-list" element={<EmployeesListPage />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </Provider>
    )
}

// Global cleanup
afterEach(() => {
    cleanup();
    localStorage.clear();
});

describe('EmployeesListPage', () => {

    describe('No employee data', () => {
        beforeEach(() => {
            renderEmployeesListPage();
        });

        it('should render page with alert when no employees are recorded', () => {
            expect(screen.getByText(/View Current Employees/i)).toBeInTheDocument();
            expect(screen.getByText(/No employee data found/i)).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /Home/i })).toBeInTheDocument();
        });

        it('should have disabled controls when no employees exist', () => {
            const searchInput = screen.getByLabelText(/Search employee data/i);
            const entriesSelect = screen.getByLabelText(/Entries to show/i);
            
            expect(searchInput).toBeDisabled();
            expect(entriesSelect).toBeDisabled();
        });

        it('should not display employee table when no employees exist', () => {
            expect(screen.queryByRole('table')).not.toBeInTheDocument();
        });
    })

    describe('With employee data', () => {
        const mockEmployees = [
            {
                id: 1,
                firstName: "John",
                lastName: "Doe",
                dateOfBirth: "1990-01-01",
                startDate: "2020-01-01",
                street: "123 Main St",
                city: "Anytown",
                state: "CA",
                zipCode: "12345",
                department: "Engineering"
            },
            {
                id: 2,
                firstName: "Jane",
                lastName: "Smith",
                dateOfBirth: "1985-05-05",
                startDate: "2019-05-05",
                street: "456 Elm St",
                city: "Othertown",
                state: "NY",
                zipCode: "67890",
                department: "Marketing"
            }
        ];

        beforeEach(() => {
            const store = createTestStore({
                employees: { employee: mockEmployees }
            });
            renderEmployeesListPage(store);
        });

        it('should render employee table with data', async() => {
            // Wait for the page to load
            await waitFor(() => {
                expect(screen.getByText(/View Current Employees/i)).toBeInTheDocument();
            });

            // Wait for the table to load first (due to lazy loading)
            await waitFor(() => {
                expect(screen.getByRole('table')).toBeInTheDocument();
            });
            
            // Check table headers
            expect(screen.getByText(/First Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Last Name/i)).toBeInTheDocument();
            expect(screen.getByText(/Start Date/i)).toBeInTheDocument();
            expect(screen.getByText(/Department/i)).toBeInTheDocument();
            
            // Check employee data
            expect(screen.getByText('John')).toBeInTheDocument();
            expect(screen.getByText('Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane')).toBeInTheDocument();
            expect(screen.getByText('Smith')).toBeInTheDocument();
        });

        it('should allow searching employees by name', async () => {
            const user = userEvent.setup();

            // Wait for the page to load
            await waitFor(() => {
                expect(screen.getByText(/View Current Employees/i)).toBeInTheDocument();
            });

            const searchInput = screen.getByLabelText(/Search employee data/i);

            // Wait for the table to load first (due to lazy loading)
            await waitFor(() => {
                expect(screen.getByRole('table')).toBeInTheDocument();
            });

            // Initially, all employees should be visible (header + 2 data rows)
            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows).toHaveLength(3);
            });
            
            await user.type(searchInput, 'John');

            await waitFor(() => {
                const rows = screen.getAllByRole('row');
                expect(rows.length).toBe(2); // Header row + 1 employee row
            });

            expect(screen.getByText('John')).toBeInTheDocument();
            expect(screen.queryByText('Jane')).not.toBeInTheDocument();
        });

        it('should change entries display count', async () => {
            const user = userEvent.setup();
            const entriesSelect = document.querySelector('select[name="entriesToShow"]');
            
            await user.selectOptions(entriesSelect, '10');
            
            expect(entriesSelect.value).toBe('10');
        });
    });

    describe('Employee editing and deletion', () => {
        const mockEmployees = [
            {
                id: "1",
                firstName: "John",
                lastName: "Doe",
                dateOfBirth: "1990-01-01",
                startDate: "2020-01-01",
                street: "123 Main St",
                city: "Anytown",
                state: "CA",
                zipCode: "12345",
                department: "Engineering"
            }
        ];

        it('should allow editing an employee', async () => {
            const user = userEvent.setup();

            const store = createTestStore({
                employees: { employee: mockEmployees }
            });
            renderEmployeesListPage(store);
            localStorage.clear();

            // Stub window.confirm to return true (user clicks OK)
            const originalConfirm = window.confirm;
            window.confirm = () => true;

            // Wait for the page to load
            await waitFor(() => {
                expect(screen.getByText(/View Current Employees/i)).toBeInTheDocument();
            });

            // Wait for the table to load first (due to lazy loading)
            await waitFor(() => {
                expect(screen.getByRole('table')).toBeInTheDocument();
            });

            // Click edit button
            const editButton = screen.getByRole('button', { name: /Edit/i });
            await user.click(editButton);

            // Check if edit form is displayed
            await waitFor(() => {
                const firstNameInput = screen.getByDisplayValue('John');
                expect(firstNameInput).toBeInTheDocument();
                expect(firstNameInput).toHaveAttribute('name', 'firstName'); // Verify it's the right field
            });


            // Change first name
            const firstNameInput = screen.getByDisplayValue('John');
            await user.clear(firstNameInput);
            await user.type(firstNameInput, 'Joe');

            // Save changes
            const saveButton = screen.getByRole('button', { name: /Change/i });
            await user.click(saveButton);

            // Test Redux state update
            await waitFor(() => {
                const updatedState = store.getState();
                expect(updatedState.employees.employee).toHaveLength(1);
                expect(updatedState.employees.employee[0].firstName).toBe('Joe');
                expect(updatedState.employees.employee[0].id).toBe('1'); // Same employee, different name
            });

            // Test localStorage update 
            await waitFor(() => {
                const localStorageData = localStorage.getItem("employeeList");
                expect(localStorageData).toBeTruthy();

                const parsedData = JSON.parse(localStorageData);
                expect(parsedData).toHaveLength(1);
                expect(parsedData[0].firstName).toBe('Joe');
                expect(parsedData[0].id).toBe('1'); // Same employee, different name
            });

            // Check if changes are reflected in the table
            await waitFor(() => {
                expect(screen.getByText('Joe')).toBeInTheDocument();
                expect(screen.queryByText('John')).not.toBeInTheDocument();
                expect(firstNameInput).not.toBeInTheDocument(); // Edit form should be closed
            });

            // Restore original confirm function
            window.confirm = originalConfirm;
        });

        it('should allow deleting an employee', async () => {
            const user = userEvent.setup();

            const store = createTestStore({
                employees: { employee: mockEmployees }
            });
            renderEmployeesListPage(store);
            localStorage.clear();

            // Stub window.confirm to return true (user clicks OK)
            const originalConfirm = window.confirm;
            window.confirm = () => true;

            // Wait for the page to load
            await waitFor(() => {
                expect(screen.getByText(/View Current Employees/i)).toBeInTheDocument();
            });

            // Wait for the table to load first (due to lazy loading)
            await waitFor(() => {
                expect(screen.getByRole('table')).toBeInTheDocument();
            });

            // Click delete button
            const deleteButton = screen.getByRole('button', { name: /Delete/i });
            await user.click(deleteButton);

            // Test Redux state update (employee should be removed)
            await waitFor(() => {
                const updatedState = store.getState();
                expect(updatedState.employees.employee).toHaveLength(0);
            });

            //Test localStorage update (employee should be removed)
            await waitFor(() => {
                const localStorageData = localStorage.getItem("employeeList");
                expect(localStorageData).toBeTruthy();

                const parsedData = JSON.parse(localStorageData);
                expect(parsedData).toHaveLength(0); // Employee should be removed
            });

            // Check if employee is removed from the table
            await waitFor(() => {
                expect(screen.queryByText('John')).not.toBeInTheDocument();
            });

            // Restore original confirm function
            window.confirm = originalConfirm;
        });
    });

    describe('Navigation link', () => {
        beforeEach(() => {
            renderEmployeesListPage();
        });

        it('should navigate to Add Employees page when link is clicked', async () => {
            const user = userEvent.setup();
            const addEmployeeLink = screen.getByRole('link', { name: /Home/i });

            // Click the link
            await user.click(addEmployeeLink);

            // Check if we are on the Add Employees page
            expect(screen.getByText(/Create Employee/i)).toBeInTheDocument();
           
        });
    });

})

