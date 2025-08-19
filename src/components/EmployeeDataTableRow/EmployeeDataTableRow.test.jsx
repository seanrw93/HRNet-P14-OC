import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeDataTableRow from './EmployeeDataTableRow';
import { beforeEach, afterEach, expect, describe, it, vi } from 'vitest';

describe('EmployeeDataTableRow', () => {
    const mockEmployee = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01', 
        startDate: '2020-01-01',
        street: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        department: 'Engineering',
    };

    const mockProps = {
        employee: mockEmployee,
        editId: null,
        keys: ['firstName', 'lastName', 'dateOfBirth', 'startDate', 'street', 'city', 'state', 'zipCode', 'department'],
        editValues: {},
        handleEditChange: vi.fn(),
        error: [],
        departmentsOptions: ['Engineering', 'Marketing', 'Sales'].map(dept => <option key={dept} value={dept}>{dept}</option>),
        statesOptions: ['CA', 'NY', 'TX'].map(state => <option key={state} value={state}>{state}</option>),
        handleEditSave: vi.fn(),
        setEditId: vi.fn(),
        enterEditMode: vi.fn(),
        handleDelete: vi.fn(),
    }

    beforeEach(() => {
        // Clear all mock functions
        Object.values(mockProps).forEach(prop => {
            if (prop && typeof prop.mockClear === 'function') {
                prop.mockClear();
            }
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render employee data in read-only mode', () => {
            render(<EmployeeDataTableRow {...mockProps} />);
            
            expect(screen.getByText(mockEmployee.firstName)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.lastName)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.dateOfBirth)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.startDate)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.street)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.city)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.state)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.zipCode)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.department)).toBeInTheDocument();
        });

        it('should render edit and delete buttons when not in edit mode', () => {
            render(<EmployeeDataTableRow {...mockProps} />);
            
            const editButton = screen.getByRole('button', { name: 'Edit' });
            const deleteButton = screen.getByRole('button', { name: 'Delete' });
            
            expect(editButton).toBeInTheDocument();
            expect(deleteButton).toBeInTheDocument();
            expect(screen.getByRole('cell', { name: 'John' })).toBeInTheDocument();
            expect(screen.getByRole('cell', { name: 'Doe' })).toBeInTheDocument();
        });

        it('should render form inputs when in edit mode', async () => {
            const propsInEditMode = { ...mockProps, editId: mockEmployee.id, editValues: mockEmployee };
            render(<EmployeeDataTableRow {...propsInEditMode} />);

            // Focus the edit inputs
            await waitFor(() => {
                expect(screen.getByDisplayValue(mockEmployee.firstName)).toBeInTheDocument();
                expect(screen.getByDisplayValue(mockEmployee.lastName)).toBeInTheDocument();
                expect(screen.getByDisplayValue(mockEmployee.dateOfBirth)).toBeInTheDocument();
                expect(screen.getByDisplayValue(mockEmployee.startDate)).toBeInTheDocument();
                expect(screen.getByDisplayValue(mockEmployee.street)).toBeInTheDocument();
                expect(screen.getByDisplayValue(mockEmployee.city)).toBeInTheDocument();
                expect(screen.getByDisplayValue(mockEmployee.zipCode)).toBeInTheDocument();

                const stateSelect = screen.getByDisplayValue(mockEmployee.state);
                const departmentSelect = screen.getByDisplayValue(mockEmployee.department);

                expect(stateSelect).toBeInTheDocument();
                expect(departmentSelect).toBeInTheDocument();
            });
        });

        
        it('should render change and cancel buttons when in edit mode', () => {
            const propsInEditMode = { ...mockProps, editId: mockEmployee.id, editValues: mockEmployee };
            render(<EmployeeDataTableRow {...propsInEditMode} />);

            expect(screen.getByRole('button', { name: 'Change' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('should call enterEditMode when edit button is clicked', async () => {
            render(<EmployeeDataTableRow {...mockProps} />);

            const user = userEvent.setup();

            const editButton = screen.getByRole('button', { name: 'Edit' });
            await user.click(editButton);

            await waitFor(() => {
                expect(mockProps.enterEditMode).toHaveBeenCalledWith(mockEmployee);
            });
        });

        it('should call handleDelete when delete button is clicked', async () => {
            render(<EmployeeDataTableRow {...mockProps} />);

            const user = userEvent.setup();

            const deleteButton = screen.getByRole('button', { name: 'Delete' });
            await user.click(deleteButton);

            expect(mockProps.handleDelete).toHaveBeenCalledWith(mockEmployee.id);
        });

        it('should call handleEditSave when change button is clicked', async () => {
            const propsInEditMode = { ...mockProps, editId: mockEmployee.id, editValues: mockEmployee };
            render(<EmployeeDataTableRow {...propsInEditMode} />);

            const user = userEvent.setup();

            const saveButton = screen.getByRole('button', { name: 'Change' });
            await user.click(saveButton);

            expect(mockProps.handleEditSave).toHaveBeenCalled();
        });

        it('should call setEditId with null when cancel button is clicked', async () => {
            const propsInEditMode = { ...mockProps, editId: mockEmployee.id, editValues: mockEmployee };
            render(<EmployeeDataTableRow {...propsInEditMode} />);

            const user = userEvent.setup();

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            await user.click(cancelButton);

            expect(mockProps.setEditId).toHaveBeenCalledWith(null);
        });
    });

    describe('Error Display', () => {
        it('should display error feedback when errors exist', () => {            
            const propsWithErrors = { 
                ...mockProps, 
                editId: mockEmployee.id, 
                editValues: mockEmployee,
                error: ['firstName', 'lastName'] 
            };

            render(<EmployeeDataTableRow {...propsWithErrors} />);

            expect(screen.getByText(/Please provide a first name./)).toBeInTheDocument();
            expect(screen.getByText(/Please provide a last name./)).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels for screen readers', () => {
            render(<EmployeeDataTableRow {...mockProps} />);

            expect(screen.getByRole('button', { name: 'Edit' })).toHaveAccessibleName('Edit');
            expect(screen.getByRole('button', { name: 'Delete' })).toHaveAccessibleName('Delete')
        });

        it('should be keyboard accessible', async () => {
            render(<EmployeeDataTableRow {...mockProps} />);

            const user = userEvent.setup();

            const editButton = screen.getByRole('button', { name: 'Edit' });
            const deleteButton = screen.getByRole('button', { name: 'Delete' });

            // Focus the edit button
            await user.tab();
            expect(editButton).toHaveFocus();
            await user.keyboard('{Enter}');
            expect(mockProps.enterEditMode).toHaveBeenCalledWith(mockEmployee);

            // Focus the delete button
            await user.tab();
            expect(deleteButton).toHaveFocus();
            await user.keyboard('{Enter}');
            expect(mockProps.handleDelete).toHaveBeenCalledWith(mockEmployee.id);

        });
    });
});
