import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/templates/Layout/Layout';
import NotFound from './NotFound';

describe('NotFound', () => {
    
    describe('Component Rendering', () => {
        it('should render the NotFound component with correct content', () => {
            render(
                <MemoryRouter initialEntries={['/non-existent-route']}>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText('404')).toBeInTheDocument();
            expect(screen.getByText('Page not found')).toBeInTheDocument(); // Note: lowercase 'n'
            expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
        });

        it('should render when no route matches', () => {
            render(
                <MemoryRouter initialEntries={['/completely-invalid-path']}>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText('404')).toBeInTheDocument();
            expect(screen.getByText('Page not found')).toBeInTheDocument();
        });

        it('should have a home link that navigates to root', () => {
            render(
                <MemoryRouter initialEntries={['/invalid']}>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            const homeLink = screen.getByRole('link', { name: 'Home' });
            expect(homeLink).toHaveAttribute('href', '/');
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading structure for screen readers', () => {
            render(
                <MemoryRouter initialEntries={['/404']}>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            const headings = screen.getAllByRole('heading');
            expect(headings).toHaveLength(2);
            expect(headings[0]).toHaveAccessibleName('404');
            expect(headings[1]).toHaveAccessibleName('Page not found');
        });

        it('should have accessible navigation link', () => {
            render(
                <MemoryRouter initialEntries={['/404']}>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            );

            const homeLink = screen.getByRole('link', { name: 'Home' });
            expect(homeLink).toHaveAccessibleName('Home');
            expect(homeLink).toBeVisible();
        });
    });
});