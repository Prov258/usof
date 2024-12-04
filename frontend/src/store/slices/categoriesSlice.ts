import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import type { Category } from '../../types';

interface CategoriesState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
}

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async () => {
        const { data } = await axios.get(`/categories`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return data;
    },
);

const initialState: CategoriesState = {
    categories: [],
    isLoading: false,
    error: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload.data;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || 'Failed to fetch categories';
            });
    },
});

export default categoriesSlice.reducer;
