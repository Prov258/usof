import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState, User } from '../../types';

const API_URL = 'http://localhost:3000/api';

export const login = createAsyncThunk(
    'auth/login',
    async (
        { email, password }: { email: string; password: string },
        { rejectWithValue },
    ) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await axios.post(
                `${API_URL}/auth/login`,
                {
                    email,
                    password,
                },
                config,
            );
            return data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

export const register = createAsyncThunk(
    'auth/register',
    async (
        userData: {
            login: string;
            email: string;
            password: string;
            fullName: string;
        },
        { rejectWithValue },
    ) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            await axios.post(`${API_URL}/auth/register`, userData, config);
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            await axios.post(
                `${API_URL}/auth/password-reset`,
                { email },
                config,
            );
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            await axios.post(
                `${API_URL}/auth/password-reset/${token}`,
                { password },
                config,
            );
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData: Partial<User>, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            const response = await axios.patch(
                `${API_URL}/users/${userData.id}`,
                userData,
                config,
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

export const uploadAvatar = createAsyncThunk(
    'auth/uploadAvatar',
    async (data, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            console.log(data);
            const response = await axios.patch(
                `${API_URL}/users/avatar`,
                data,
                config,
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || null),
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    success: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        clearSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.user = payload.user;
                state.token = payload.accessToken;
                localStorage.setItem('user', JSON.stringify(payload.user));
                localStorage.setItem('token', payload.accessToken);
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload || 'Login failed';
            })
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(register.fulfilled, (state) => {
                state.success = true;
                state.isLoading = false;
            })
            .addCase(register.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload || 'Registration failed';
            })
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
            })
            .addCase(forgotPassword.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
            })
            .addCase(resetPassword.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to update profile';
            })
            .addCase(uploadAvatar.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(uploadAvatar.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to update profile';
            });
    },
});

export const { logout, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
