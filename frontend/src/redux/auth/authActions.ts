import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const backendURL = 'http://127.0.0.1:3000';

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ email, fullName, login, password }, { rejectWithValue }) => {
        try {
            console.log(email);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            await axios.post(
                `${backendURL}/api/auth/register`,
                { email, fullName, login, password },
                config,
            );
        } catch (error) {
            // return custom error message from backend if present
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);
