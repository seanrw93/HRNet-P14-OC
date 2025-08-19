import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SuccessModal from './SuccessModal';
import { beforeEach, afterEach, expect, describe, it, vi } from 'vitest';

describe('SuccessModal', () => {
    const mockProps = {
        show: true,
        onHide: vi.fn(),
        title: "Success",
        message: "Employee successfully created",
        buttonText: "Close",
        onConfirm: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render the modal when show is true', () => {
            render(<SuccessModal {...mockProps} />);
            
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(mockProps.title)).toBeInTheDocument();
            expect(screen.getByText(mockProps.message)).toBeInTheDocument();
            expect(screen.getByText(mockProps.buttonText)).toBeInTheDocument();
        });

        it('should not render the modal when show is false', () => {
            render(<SuccessModal {...mockProps} show={false} />);
            
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('should render with default props when optional props are not provided', () => {
            const minimalProps = {
                show: true,
                onHide: vi.fn(),
                message: "Test message"
            };
            
            render(<SuccessModal {...minimalProps} />);
            
            expect(screen.getByText('Alert')).toBeInTheDocument();
            expect(screen.getByText('Test message')).toBeInTheDocument();
            expect(screen.getByText('Close')).toBeInTheDocument();
        });

        it('should render custom title, message and button text', () => {
            const customProps = {
                ...mockProps,
                title: "Custom Title",
                message: "Custom message here",
                buttonText: "Got it"
            };
            
            render(<SuccessModal {...customProps} />);
            
            expect(screen.getByText('Custom Title')).toBeInTheDocument();
            expect(screen.getByText('Custom message here')).toBeInTheDocument();
            expect(screen.getByText('Got it')).toBeInTheDocument();
        });
    });

    describe('User Interactions', () => {
        it('should call onConfirm and onHide when action button is clicked', async () => {
            const user = userEvent.setup();
            render(<SuccessModal {...mockProps} />);
            
            const actionButton = screen.getByText(mockProps.buttonText);
            await user.click(actionButton);
            
            expect(mockProps.onConfirm).toHaveBeenCalledTimes(1);
            expect(mockProps.onHide).toHaveBeenCalledTimes(1);
        });

        it('should only call onHide when onConfirm is not provided', async () => {
            const user = userEvent.setup();
            const onHideMock = vi.fn();
            const propsWithoutConfirm = { 
                ...mockProps, 
                onConfirm: undefined,
                onHide: onHideMock
            };
            render(<SuccessModal {...propsWithoutConfirm} />);
            
            const actionButton = screen.getByText(mockProps.buttonText);
            await user.click(actionButton);
            
            expect(onHideMock).toHaveBeenCalledTimes(1);
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            render(<SuccessModal {...mockProps} />);
            
            const modal = screen.getByRole('dialog');
            expect(modal).toBeInTheDocument();
        });

        it('should be focusable and manageable by keyboard', () => {
            render(<SuccessModal {...mockProps} />);
            
            const actionButton = screen.getByText(mockProps.buttonText);
            expect(actionButton).toBeInTheDocument();
            
            actionButton.focus();
            expect(actionButton).toHaveFocus();
        });

        it('should have accessible title', () => {
            render(<SuccessModal {...mockProps} />);
            
            expect(screen.getByText(mockProps.title)).toBeInTheDocument();
        });
    });
});