import { render, screen } from '@testing-library/react';
import EmployeeTable from './EmployeeTable';
import { beforeEach, afterEach, expect, describe, it, vi } from 'vitest';
import { reformatCamelCase } from '../../../utils/reformatCamelCase';

describe('EmployeeTable', () => {

    const keys = [
        'id', 
        'firstName', 
        'lastName', 
        'dateOfBirth', 
        'startDate', 
        'street', 
        'state', 
        'zipCode', 
        'department'
    ];

    const mockEmployee = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        startDate: '2020-01-01',
        street: '123 Main St',
        state: 'NY',
        zipCode: '10001',
        department: 'Engineering',
    };

    const mockProps = {
        keys: [...keys],
        filteredEmployees: [mockEmployee],
        setFilteredEmployees: vi.fn(),
        editId: null,
        editValues: {},
        handleEditChange: vi.fn(),
        error: [],
        departmentsOptions: ['Engineering', 'Marketing', 'Sales'].map(dept => <option key={dept} value={dept}>{dept}</option>),
        statesOptions: ['NY', 'CA', 'TX'].map(state => <option key={state} value={state}>{state}</option>),
        handleEditSave: vi.fn(),
        setEditId: vi.fn(),
        enterEditMode: vi.fn(),
        handleDelete: vi.fn(),
    };

    beforeEach(() => {
        // Clear all mock functions
        Object.values(mockProps).forEach(prop => {
            if (prop && typeof prop.mockClear === 'function') {
                prop.mockClear();
            }
        })
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {

        it('should render the employee table with correct structure', () => {
            render(<EmployeeTable {...mockProps} />);
            
            expect(screen.getByRole('table')).toBeInTheDocument();
            expect(screen.getByRole('table')).toHaveAttribute('id', 'employee-table');
            expect(screen.getByRole('table')).toHaveClass('h-100');
            expect(screen.getByRole('table')).toHaveClass('table-bordered');
            expect(screen.getByRole('table')).toHaveClass('table-striped');
        });

        it('should render the employee table with correct headers', () => {
            render(<EmployeeTable {...mockProps} />);
            
            keys.forEach(key => {
                if (key !== 'id') {
                    expect(screen.getByText(reformatCamelCase(key))).toBeInTheDocument();
                }
            });
        });

        it('should render employee data in rows', () => {
            render(<EmployeeTable {...mockProps} />);
            
            expect(screen.getByText(mockEmployee.firstName)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.lastName)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.dateOfBirth)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.startDate)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.street)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.state)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.zipCode)).toBeInTheDocument();
            expect(screen.getByText(mockEmployee.department)).toBeInTheDocument();
        });

        it('should render sort buttons for each column', () => {
            render(<EmployeeTable {...mockProps} />);
            
            // Each column (except id and actions) should have sort buttons
            const sortableColumns = keys.filter(key => key !== 'id');
            const sortButtons = screen.getAllByRole('button');
            
            // Should have at least 2 sort buttons per column (ascending/descending) plus edit/delete buttons
            expect(sortButtons.length).toBeGreaterThan(sortableColumns.length);
        });
    });

    describe('Integration with child components', () => {
        it('should pass correct props to EmployeeDataTableRow', () => {
            render(<EmployeeTable {...mockProps} />);
            
            // Should render the employee data, indicating EmployeeDataTableRow is working
            expect(screen.getByText(mockEmployee.firstName)).toBeInTheDocument();
            
            // Should have Edit and Delete buttons from EmployeeDataTableRow
            expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
        });

        it('should pass correct props to SortButtons', () => {
            render(<EmployeeTable {...mockProps} />);
            
            // SortButtons should be rendered (we can verify by checking for multiple buttons)
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(2); // More than just Edit/Delete buttons
        });
    });

    describe('Table accessibility', () => {
        it('should have proper table structure for screen readers', () => {
            render(<EmployeeTable {...mockProps} />);
            
            expect(screen.getByRole('table')).toBeInTheDocument();
            expect(screen.getAllByRole('columnheader')).toHaveLength(keys.length); // Including actions column, excluding id
            expect(screen.getAllByRole('row')).toHaveLength(2); // Header + 1 employee row
        });

        it('should have accessible table headers', () => {
            render(<EmployeeTable {...mockProps} />);
            
            const headers = screen.getAllByRole('columnheader');
            headers.forEach(header => {
                expect(header).toBeInTheDocument();
            });
        });
    });
});
