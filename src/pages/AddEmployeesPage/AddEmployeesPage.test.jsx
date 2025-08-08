import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';

import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from '../../store/store';
import AddEmployeesPage from './AddEmployeesPage';
import EmployeesListPage from '../EmployeesListPage/EmployeesListPage';
import Layout from '../../components/Layout';

import { states } from '../../data/states';
import { departments } from '../../data/departments';
import { beforeEach } from 'vitest';

const renderAddEmployeesPage = () => {
    render(
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />} >
                        <Route index element={<AddEmployeesPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}


describe("Form rendering", () => {

    beforeEach(renderAddEmployeesPage);

    it ("should render the form correctly", () => {

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

        states.forEach(state => {
            expect(screen.getByText(state.name)).toBeInTheDocument();
        })

        //Select a department
        await user.click(deptSelect);
        await user.click(screen.getByText(/Engineering/i));

        departments.forEach(dept => {
            expect(screen.getByText(dept)).toBeInTheDocument();
        });
    });
});

describe("Datepicker functionality", () => {

    beforeEach(renderAddEmployeesPage);

    it("should launch the react-i18n-datepicker plugin when clicking date fields", async () => {
        const user = userEvent.setup();

        const dateOfBirth = screen.getByLabelText(/Date of Birth/i);
        const startDate = screen.getByLabelText(/Start Date/i);

        await user.click(dateOfBirth);
        await user.click(startDate);

        expect(document.querySelector("#calendar")).toBeInTheDocument();
    });
});

describe("Navigate link", () => {

    beforeEach(renderAddEmployeesPage);

    it("should navigate user to the EmployeesListPage route", async() => {
        const user = userEvent.setup();

        const link = screen.getByRole("link", {name: /View Current Employees/i})

        await user.click(link);

        expect(window.location.pathname).toBe("/employees-list");
        expect(screen.getByText(/View Current Employees/i)).toBeInTheDocument();
    }); 
});

describe("form submission", () => {

    beforeEach(renderAddEmployeesPage);

    const fillOutCompleteForm = async (user) => {
        await user.type(screen.getByLabelText(/First Name/i), 'John');
        await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
        await user.type(screen.getByLabelText(/Street/i), '123 Main St');
        await user.type(screen.getByLabelText(/City/i), 'New York');
        await user.type(screen.getByLabelText(/Zip Code/i), '10001');
        
        // Select state
        await user.click(screen.getByLabelText(/State/i));
        await user.click(screen.getByText(/New York/i));
        
        // Select department
        await user.click(screen.getByLabelText(/Department/i));
        await user.click(screen.getByText(/Engineering/i));
        
        // Fill date fields
        await user.type(screen.getByLabelText(/Date of Birth/i), '01/01/1990');
        await user.type(screen.getByLabelText(/Start Date/i), '01/01/2023');
    };
});