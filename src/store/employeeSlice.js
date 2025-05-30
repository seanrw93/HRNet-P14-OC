import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    employee: JSON.parse(localStorage.getItem("employeeList")) || [],
}

const employeeSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {
        addEmployee: (state, action) => {
            state.employee.push(action.payload)
        }
    }
})

export const { addEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;