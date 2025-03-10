import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../../services/userService';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  users: [],
  user: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

// Async thunks
export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers(filters);
      return response;
    } catch (error) {
      const message = error.message || 'Failed to fetch users';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response;
    } catch (error) {
      const message = error.message || 'Failed to fetch user details';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserRole(id, role);
      toast.success('User role updated successfully!');
      return response;
    } catch (error) {
      const message = error.message || 'Failed to update user role';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await userService.toggleUserStatus(id, isActive);
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully!`);
      return response;
    } catch (error) {
      const message = error.message || 'Failed to update user status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Get patients
export const getPatients = createAsyncThunk(
  'users/getPatients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await userService.getPatients();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Users slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.error = null;
      state.isLoading = false;
    },
    resetUsersState: (state) => {
      state.users = [];
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.total,
        };
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get User by ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        
        // Update in the list if it exists
        const index = state.users.findIndex(
          (u) => u.id === action.payload.user.id
        );
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Toggle User Status
      .addCase(toggleUserStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        
        // Update in the list if it exists
        const index = state.users.findIndex(
          (u) => u.id === action.payload.user.id
        );
        if (index !== -1) {
          state.users[index] = action.payload.user;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get Patients
      .addCase(getPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.patients;
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserState, resetUsersState } = usersSlice.actions;
export default usersSlice.reducer; 