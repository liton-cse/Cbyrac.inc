// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../feature/user/userSlice";
import userStatisticReducer from "../feature/overview/userStatisticSlice";
import userFilterReducer from "../feature/overview/userFilterSlice";
import employeeFilterReducer from "../feature/overview/employeeSlice";
import adminFormReducer from "../feature/adminForm/adminFormSlice";
import calendarReducer from "../feature/calendar/calendarSlice";
import tempEmployeeReducer from "../feature/tempEmployee/tempEmployeeSlice";
import internEmployeeReducer from "../feature/Internemployee/internSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    userStatistics: userStatisticReducer,
    userFilters: userFilterReducer,
    employeeFilter: employeeFilterReducer,
    adminForm: adminFormReducer,
    calendar: calendarReducer,
    tempEmployee: tempEmployeeReducer,
    internEmployee: internEmployeeReducer,
  },
  devTools: import.meta.env.NODE_ENV !== "production",
});
