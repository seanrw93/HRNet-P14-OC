import { render, screen } from '@testing-library/react';
import Loader from './Loader';
import { beforeEach, expect, describe, it } from 'vitest';

describe('Loader', () => {
    
    describe('Basic rendering', () => {
        beforeEach(() => {
            render(<Loader />);
        });
        it('should render the loader spinner', () => {
            const loader = screen.getByRole('status');
            expect(loader).toBeInTheDocument();
        });

        it('should have correct Bootstrap spinner classes', () => {
            const loader = screen.getByRole('status');
            expect(loader).toHaveClass('spinner-border');
            expect(loader).toHaveClass('text-primary');
            expect(loader).toHaveClass('spinner-border-lg');
            expect(loader).toHaveClass('d-block');
            expect(loader).toHaveClass('mx-auto');
            expect(loader).toHaveClass('my-5');
        });
    });

    describe('Loading state integration', () => {

        // Mock component that simulates loading table data
        const MockTableComponent = ({ employees, isLoading }) => {
            if (isLoading) {
                return <Loader />;
            }

            if (employees.length === 0) {
                return <div>No employee data found</div>;
            }

            return (
                <table>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        };

        it('should render while table data is loading', () => {
            render(<MockTableComponent employees={[]} isLoading={true} />);
            
            expect(screen.getByRole('status')).toBeInTheDocument();
            expect(screen.getByText('Loading...')).toBeInTheDocument();
            expect(screen.queryByText('No employee data found')).not.toBeInTheDocument();
        });

        it('should not render when table data has loaded', () => {
            const mockEmployees = [
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Smith' }
            ];

            render(<MockTableComponent employees={mockEmployees} isLoading={false} />);
            
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        it('should not render when no data is available (not loading)', () => {
            render(<MockTableComponent employees={[]} isLoading={false} />);
            
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            expect(screen.getByText('No employee data found')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have appropriate ARIA roles and attributes', () => {
            render(<Loader />);
            
            const loader = screen.getByRole('status');
            expect(loader).toHaveAttribute('role', 'status');
        });

        it('should have a visually hidden text for screen readers', () => {
            render(<Loader />);
            
            const hiddenText = screen.getByText('Loading...');
            expect(hiddenText).toHaveClass('visually-hidden');
        });
    });
}); 
