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
        },
        updateEmployee: (state, action) => {
            const id = action.payload.id;
            const employeeIndex = state.employee.findIndex(employee => employee.id === id);
            Object.keys(action.payload).forEach(key => {
                if (key !== "id") (
                    state.employee[employeeIndex][key] = action.payload[key]
                )
            })
        }
    }
})

export const { addEmployee, deleteEmployee, updateEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;