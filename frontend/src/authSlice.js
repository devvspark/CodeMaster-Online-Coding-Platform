import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'; // Import Redux Toolkit functions for async actions and creating slices
import axiosClient from './utils/axiosClient' // Import custom axios client for API calls

// Async thunk for registering a user
export const registerUser = createAsyncThunk(
  'auth/register', // Action type
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/register', userData); // Send POST request to register user
      return response.data.user; // Return user data if successful
    } catch (error) {
      return rejectWithValue(error); // Return error if request fails
    }
  }
);

// Async thunk for logging in a user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials); // Send POST request to login
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk to check if user is already authenticated (e.g., on app load)
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/user/check'); // Send GET request to verify session
      return data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue(null); // Return null if user not logged in
      }
      return rejectWithValue(error);
    }
  }
);

// Async thunk to logout user
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout'); // Send POST request to logout
      return null; // Return null because user is now logged out
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create a slice of state for auth
const authSlice = createSlice({
  name: 'auth', // Name of the slice
  initialState: {
    user: null, // Holds user data
    isAuthenticated: false, // True if user is logged in
    loading: false, // Indicates loading state
    error: null // Stores error messages
  },
  reducers: {
    // No extra reducers here
  },
  extraReducers: (builder) => {
    builder
      // Handle register user cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true; // Set loading true while request is in progress
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false; // Set loading false once request is done
        state.isAuthenticated = !!action.payload; // Update authentication state
        state.user = action.payload; // Set user data
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong'; // Store error
        state.isAuthenticated = false;
        state.user = null;
      })

      // Handle login user cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })

      // Handle check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })

      // Handle logout user cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

// Export the reducer to be used in store
export default authSlice.reducer;
