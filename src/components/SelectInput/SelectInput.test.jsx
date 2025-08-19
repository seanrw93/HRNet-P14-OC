import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectInput from './SelectInput';
import { beforeEach, afterEach, expect, describe, it, vi } from 'vitest';

describe('SelectInput', () => {
    
    const mockProps = {
        label: 'Test Select',
        name: 'testSelect',
        value: '',
        onChange: vi.fn(),
        options: ['Option 1', 'Option 2', 'Option 3'],
        isInvalid: false,
        required: true,
        feedback: 'Please select an option'
    };

    beforeEach(() => {
        mockProps.onChange.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render the select input with correct label and options', () => {
            render(<SelectInput {...mockProps} />);
            
            expect(screen.getByLabelText(mockProps.label)).toBeInTheDocument();
            expect(screen.getByRole('combobox')).toBeInTheDocument();
            mockProps.options.forEach(option => {
            expect(screen.getByText(option)).toBeInTheDocument();
            });
        });

        it('should render the feedback message when isInvalid is true', () => {
            render(<SelectInput {...mockProps} isInvalid={true} />);
            
            expect(screen.getByText(mockProps.feedback)).toBeInTheDocument();
            expect(screen.getByRole('combobox')).toHaveClass('is-invalid');
            expect(screen.getByRole('combobox')).toBeRequired();
        });

        it('should not be required when required prop is false', () => {
            render(<SelectInput {...mockProps} required={false} />);
            
            expect(screen.getByRole('combobox')).not.toBeRequired();
        });
    });

    describe('User Interaction', () => {
        
        it('should handle onChange correctly', async () => {
            const user = userEvent.setup();
            render(<SelectInput {...mockProps} />);

            const select = screen.getByRole('combobox');
            await user.selectOptions(select, 'Option 3');
            
            // Verify that onChange was called
            expect(mockProps.onChange).toHaveBeenCalledTimes(1);
            expect(mockProps.onChange).toHaveBeenCalledWith(expect.any(Object));
        });

    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels for screen readers', () => {
            render(<SelectInput {...mockProps} />);

            const select= screen.getByRole('combobox');

            expect(select).toHaveAccessibleName(mockProps.label);
            expect(select).toHaveAttribute('name', mockProps.name);
        });

        it('should be keyboard accessible', async () => {
            const user = userEvent.setup();
            render(<SelectInput {...mockProps} />);
            
            const select = screen.getByRole('combobox');
            
            // Focus the select
            await user.tab();
            expect(select).toHaveFocus();
            
            await user.selectOptions(select, 'Option 1');
            expect(mockProps.onChange).toHaveBeenCalled();
            
        });
    });

});