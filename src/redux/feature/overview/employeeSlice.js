// employeeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Async thunk to fetch employees by role and/or search
export const fetchEmployeesByRole = createAsyncThunk(
  "employee/fetchEmployees",
  async (
    { employee_role, page = 1, limit = 10, search = "" },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        page,
        limit,
        employee_role: employee_role || "Fit2Lead Intern",
      };

      if (search) {
        params.firstName = search;
      }

      const url = search ? "/user/search" : "/user/filter";
      const response = await axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("Fetch employees error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employees"
      );
    }
  }
);

export const updateEmployeeStatus = createAsyncThunk(
  "employee/employee Status",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/user/${id}/status`, {
        status,
      });
      return response.data.data;
    } catch (error) {
      console.error("Fetch employees error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employees"
      );
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    pagination: {},
    loading: false,
    error: null,
    activeRole: "Fit2Lead Intern",
    searchText: "",
    pendingStatusUpdate: {},
  },
  reducers: {
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    updateStatusLocally: (state, action) => {
      const { id, status } = action.payload;
      const index = state.employees.findIndex((e) => e._id === id);
      if (index !== -1) {
        state.employees[index].employee_status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeesByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeesByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchEmployeesByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateEmployeeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        const id = action.meta.arg.id;
        state.pendingStatusUpdate[id] = true;
      })
      .addCase(updateEmployeeStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        const index = state.employees.findIndex((e) => e._id === id);
        if (index !== -1) state.employees[index].employee_status = status;
        delete state.pendingStatusUpdate[id];
      })
      .addCase(updateEmployeeStatus.rejected, (state, action) => {
        state.loading = false;
        const id = action.meta.arg.id;
        delete state.pendingStatusUpdate[id];
      });
  },
});

export const { setActiveRole, setSearchText, updateStatusLocally } =
  employeeSlice.actions;
export default employeeSlice.reducer;
