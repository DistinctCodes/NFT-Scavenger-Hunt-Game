import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// createAsyncthunk to signup
export const signUp = createAsyncThunk(
  'user/signUp',
  async (user, thunkAPI) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, user, { withCredentials: true });
    return response.data;
  }
);

// createAsyncthunk to login
export const login = createAsyncThunk(
  'user/login',
  async (user, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, user, { withCredentials: true });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: "Invalid credentials."
      });
    }
  }
);

// createAsyncthunk to fetch signed in user
export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (thunkAPI) => {
    const response = await axios.get(`${BASE_URL}/users/me`, { withCredentials: true });
    return response.data;
  }
);

// Our createAsyncthunk to fetch any user
export const findUser = createAsyncThunk(
  'user/findUser',
  async (userId, thunkAPI) => {
    const response = await axios.get(`${BASE_URL}/users/get/${userId}`, { withCredentials: true });
    return response.data;
  }
);

// Our createAsyncthunk to logout
export const logout = createAsyncThunk(
  'user/logout',
  async (thunkAPI) => {
    const response = await axios.delete(`${BASE_URL}/users/sessions`, { withCredentials: true });
    return response.data;
  }
);

const initialState = {
  currentUser: null,
  isFetching: false,
  error: false,
}

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: state => initialState,
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(login.pending, (state, action) => {
      state.isFetching = true;
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.isFetching = false;
      state.error = false;
    })
    builder.addCase(login.rejected, (state, { payload }) => {
      state.isFetching = false;
      if (payload) state.error = payload.message;
    })
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    })
  },
});

export const { resetState } = authSlice.actions;
export default authSlice.reducer;