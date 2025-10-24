// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../feature/user/userSlice";
import userStatisticReducer from "../feature/overview/userStatisticSlice";
import userFilterReducer from "../feature/overview/userFilterSlice";
import employeeFilterReducer from "../feature/overview/employeeSlice";
import adminFormReducer from "../feature/adminForm/adminFormSlice";
import calendarReducer from "../feature/calendar/calendarSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    userStatistics: userStatisticReducer,
    userFilters: userFilterReducer,
    employeeFilter: employeeFilterReducer,
    adminForm: adminFormReducer,
    calendar: calendarReducer,
  },
  devTools: import.meta.env.NODE_ENV !== "production",
});
