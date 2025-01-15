import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category, Paginated } from '../types';

export const categoriesApi = createApi({
    reducerPath: 'categories',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/categories',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query<Paginated<Category>, null>({
            query: () => '',
            provideTags: (result) =>
                result ? [{ type: 'Category', id: 'LIST' }] : [],
        }),
    }),
});

export const { useGetCategoriesQuery } = categoriesApi;
