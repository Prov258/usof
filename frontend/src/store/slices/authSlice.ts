import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';
import { AuthState, LoginResponse, User } from '../../types';
import axios from 'axios';
import { LoginForm } from '../../pages/auth/Login';
import { RegisterForm } from '../../pages/auth/Register';
import { ForgotPasswordForm } from '../../pages/auth/ForgotPassword';
import { PasswordResetForm } from '../../pages/auth/PasswordReset';
import { EmailVerificationForm } from '../../pages/auth/EmailVerification';

export const login = createAsyncThunk<
    LoginResponse,
    LoginForm,
    {
        rejectValue: string;
    }
>('auth/login', async (data: LoginForm, { rejectWithValue }) => {
    try {
        const response = await api.post(`/auth/login`, data);

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data.message);
        } else {
            return rejectWithValue(
                'An unexpected error occurred. Please try again.',
            );
        }
    }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/auth/logout');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message);
            } else {
                return rejectWithValue(
                    'An unexpected error occurred. Please try again.',
                );
            }
        }
    },
);

export const register = createAsyncThunk<
    void,
    RegisterForm,
    { rejectValue: string }
>('auth/register', async (data: RegisterForm, { rejectWithValue }) => {
    try {
        await api.post(`/auth/register`, data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data.message);
        } else {
            return rejectWithValue(
                'An unexpected error occurred. Please try again.',
            );
        }
    }
});

export const forgotPassword = createAsyncThunk<
    void,
    ForgotPasswordForm,
    { rejectValue: string }
>(
    'auth/forgotPassword',
    async (data: ForgotPasswordForm, { rejectWithValue }) => {
        try {
            await api.post(`/auth/password-reset`, data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message);
            } else {
                return rejectWithValue(
                    'An unexpected error occurred. Please try again.',
                );
            }
        }
    },
);

export const resetPassword = createAsyncThunk<
    void,
    PasswordResetForm & { token: string },
    { rejectValue: string }
>(
    'auth/resetPassword',
    async (
        { token, ...data }: PasswordResetForm & { token: string },
        { rejectWithValue },
    ) => {
        try {
            await api.post(`/auth/password-reset/${token}`, { data });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message);
            } else {
                return rejectWithValue(
                    'An unexpected error occurred. Please try again.',
                );
            }
        }
    },
);

export const emailVerification = createAsyncThunk<
    void,
    EmailVerificationForm,
    { rejectValue: string }
>(
    'auth/emailVerification',
    async (data: EmailVerificationForm, { rejectWithValue }) => {
        try {
            await api.post(`/auth/send-verification`, data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data.message);
            } else {
                return rejectWithValue(
                    'An unexpected error occurred. Please try again.',
                );
            }
        }
    },
);

export const updateProfile = createAsyncThunk<
    User,
    Partial<User>,
    { rejectValue: string }
>('auth/updateProfile', async (data: Partial<User>, { rejectWithValue }) => {
    try {
        const response = await api.patch(`/users/${data.id}`, data);

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data.message);
        } else {
            return rejectWithValue(
                'An unexpected error occurred. Please try again.',
            );
        }
    }
});

export const uploadAvatar = createAsyncThunk<
    User,
    FormData,
    { rejectValue: string }
>('auth/uploadAvatar', async (data: FormData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await api.patch(`/users/avatar`, data, config);

        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data.message);
        } else {
            return rejectWithValue(
                'An unexpected error occurred. Please try again.',
            );
        }
    }
});

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    success: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearUserState: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        updateCredentials: (state, { payload }) => {
            state.user = payload.user;
            state.token = payload.token;
            localStorage.setItem('user', JSON.stringify(payload.user));
            localStorage.setItem('token', payload.token);
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
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            })
            .addCase(logout.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload || 'Logout failed';
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
                state.error = payload || 'Failed to send password reset email';
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
                state.error = payload || 'Failed to reset password';
            })
            .addCase(emailVerification.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(emailVerification.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
            })
            .addCase(emailVerification.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload || 'Failed to send email verification';
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

export const { clearUserState, clearSuccess, updateCredentials } =
    authSlice.actions;
export default authSlice.reducer;
