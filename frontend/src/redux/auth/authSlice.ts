import { createSlice } from '@reduxjs/toolkit';
import { registerUser } from './authActions';

const initialState = {
    loading: false,
    userInfo: JSON.parse(localStorage.getItem('user') || null), // for user object
    userToken: null, // for storing the JWT
    error: null,
    success: false, // for monitoring the registration process.
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.success = true; // registration successful
        });
        builder.addCase(registerUser.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
    },
});

export default authSlice.reducer;
