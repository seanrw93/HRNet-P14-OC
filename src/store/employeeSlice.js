import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const initialState = {
    employee: JSON.parse(localStorage.getItem("employeeList")) || [],
}

const employeeSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {
        addEmployee: (state, action) => {
            const newEmployee = {
                ...action.payload,
                id: nanoid()
            }
            state.employee.push(newEmployee);
        },
        deleteEmployee: (state, action) => {
            state.employee = state.employee.filter((employee) => employee.id !== action.payload);
        }
    }
})

export const { addEmployee, deleteEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;