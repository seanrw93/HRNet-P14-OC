import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';

import { Routes, Route, MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from '../../store/employeeSlice';
import AddEmployeesPage from './AddEmployeesPage';
import EmployeesListPage from '../EmployeesListPage/EmployeesListPage';
import Layout from '../../components/Layout';

import { states } from '../../data/states';
import { departments } from '../../data/departments';
import { beforeEach, afterEach, expect } from 'vitest';

const createTestStore = () =>
  configureStore({
    reducer: {
      employees: employeeReducer,
    },
    preloadedState: {
      employees: {
        employee: []
      }
    }
  });

const renderAddEmployeesPage = (store = createTestStore(), initialRoute = '/') => {
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
describe('AddEmployeesPage', () => {
    describe("Form rendering", () => {
    let testStore;

    beforeEach(() => {
        testStore = createTestStore();
        renderAddEmployeesPage(testStore);
    });

    it ("should render the form correctly", () => {

        // Check if the form is present
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Street/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Zip Code/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();

        expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
    });

    it("should render dropdowns will all options", async () => {
        const user = userEvent.setup();

        const stateSelect = screen.getByLabelText(/State/i);
        const deptSelect = screen.getByLabelText(/Department/i);

        // Select a state
        await user.click(stateSelect);
        await user.click(screen.getByText(/California/i));

        // Check if all states are present
        states.forEach(state => {
            expect(screen.getByText(state.name)).toBeInTheDocument();
        })

        //Select a department
        await user.click(deptSelect);
        await user.click(screen.getByText(/Engineering/i));

        // Check if all departments are present
        departments.forEach(dept => {
            expect(screen.getByText(dept)).toBeInTheDocument();
        });
    });
    });

    describe("Datepicker functionality", () => {
        let testStore;

        beforeEach(() => {
            testStore = createTestStore();
            renderAddEmployeesPage(testStore);
        });

        it("should launch the react-i18n-datepicker plugin when clicking date fields", async () => {
            const user = userEvent.setup();

            // Check if date fields are present
            const dateOfBirth = screen.getByLabelText(/Date of Birth/i);
            const startDate = screen.getByLabelText(/Start Date/i);

            // Click on date fields to open the datepicker
            await user.click(dateOfBirth);
            await user.click(startDate);

            // Check if the datepicker is rendered
            expect(document.querySelector("#calendar")).toBeInTheDocument();
        });
    });

    describe("Navigate link", () => {
        let testStore;

        beforeEach(() => {
            testStore = createTestStore();
            renderAddEmployeesPage(testStore);
        });

        it("should navigate user to the EmployeesListPage route", async() => {
            const user = userEvent.setup();

            const link = screen.getByRole("link", {name: /View Current Employees/i});

            await user.click(link);

            // Check if the EmployeesListPage is rendered
            await waitFor(() => {
                expect(screen.getByText(/View Current Employees/i)).toBeInTheDocument();
            });
        });
    });

    describe("form submission", () => {
        let testStore;

        beforeEach(() => {
            testStore = createTestStore();
            renderAddEmployeesPage(testStore, '/');
            localStorage.clear();
        });

        it("should submit the form with valid data and add employee to Redux store", async () => {
            const user = userEvent.setup();

            // Fill out the form
            await user.type(screen.getByLabelText("First Name"), "John");
            await user.type(screen.getByLabelText("Last Name"), "Doe");

            const dobField = screen.getByLabelText("Date of Birth");
            await user.clear(dobField);
            await user.type(dobField, "01/01/1990");
            
            const startDateField = screen.getByLabelText("Start Date");
            await user.clear(startDateField);
            await user.type(startDateField, "01/01/2020");
            
            await user.selectOptions(screen.getByLabelText("Department"), "Sales");
            await user.type(screen.getByLabelText("Street"), "123 Main St");
            
            await user.type(screen.getByLabelText("City"), "New York");
            await user.selectOptions(screen.getByLabelText("State"), "NY");
            
            await user.type(screen.getByLabelText("Zip Code"), "10001");

            // Submit the form
            await user.click(screen.getByRole("button", { name: /save/i }));

            // Wait for modal to appear
            const modal = await screen.findByRole("dialog", {}, { timeout: 1000 });
            expect(modal).toBeInTheDocument();

            // Check Redux store
            const employees = testStore.getState().employees.employee;
            console.log("Employees in Redux store:", employees);

            expect(employees).toHaveLength(1);

            const addedEmployee = employees[0];
            expect(addedEmployee).toMatchObject({
                firstName: "John",
                lastName: "Doe",
                dateOfBirth: "1990-01-01",
                startDate: "2020-01-01",
                street: "123 Main St",
                city: "New York",
                state: "NY",
                zipCode: "10001",
                department: "Sales"
            });
        });

        it("should handle form validation errors", async () => {
            const user = userEvent.setup();

            // Verify we're on the correct page first
            expect(screen.getByText(/Create Employee/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();

            // Only fill partial form (missing required fields)
            await user.type(screen.getByLabelText(/First Name/i), 'John');
            // Leave other required fields empty

            const saveButton = screen.getByRole("button", { name: /Save/i });
            await user.click(saveButton);

            // Should not show success modal
            expect(screen.queryByText(/Employee sucessfully created/i)).not.toBeInTheDocument();
            
            // Should not add to Redux store
            expect(testStore.getState().employees.employee).toHaveLength(0);
            
            // Should not add to localStorage
            const localStorageData = localStorage.getItem("employeeList");
            expect(localStorageData).toBeNull();
        });

        it("should check form validation state", async () => {
            const user = userEvent.setup();

            const form = document.querySelector('form');
            expect(form).toBeInTheDocument();

            // Fill out the form with invalid data
            const saveButton = screen.getByRole("button", { name: /Save/i });
            await user.click(saveButton);
            
            // Verify form is marked as invalid
            expect(form).toHaveAttribute('novalidate');
        });

        it("should navigate to EmployeesListPage after closing success modal", async() => {
            const user = userEvent.setup();

            // Fill out the form with valid data
            await user.type(screen.getByLabelText("First Name"), "John");
            await user.type(screen.getByLabelText("Last Name"), "Doe");

            const dobField = screen.getByLabelText("Date of Birth");
            await user.clear(dobField);
            await user.type(dobField, "01/01/1990");
            
            const startDateField = screen.getByLabelText("Start Date");
            await user.clear(startDateField);
            await user.type(startDateField, "01/01/2020");
            
            await user.selectOptions(screen.getByLabelText("Department"), "Sales");
            await user.type(screen.getByLabelText("Street"), "123 Main St");
            
            await user.type(screen.getByLabelText("City"), "New York");
            await user.selectOptions(screen.getByLabelText("State"), "NY");
            
            await user.type(screen.getByLabelText("Zip Code"), "10001");
            
            await user.click(screen.getByRole("button", { name: /save/i }));

            // Wait for success modal to appear
            const modal = await screen.findByRole("dialog");
            expect(modal).toBeInTheDocument();

            // Click the Close button in the modal
            const closeButton = screen.getByText(/Close/i);
            expect(closeButton).toBeInTheDocument();

            await user.click(closeButton);

            // Check if navigated to EmployeesListPage
            await waitFor(() => {
                expect(screen.getByText(/View Current Employees/i)).toBeInTheDocument();
            });
        });
    }, 10000);
});
