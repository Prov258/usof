import { createApi } from '@reduxjs/toolkit/query/react';
import { Category, Paginated } from '../types';
import axiosBaseQuery from '../utils/axiosBaseQuery';

export const categoriesApi = createApi({
    reducerPath: 'categories',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query<Paginated<Category>, void>({
            query: () => ({
                url: '/categories',
                method: 'GET',
            }),
            providesTags: (result) =>
                result ? [{ type: 'Category', id: 'LIST' }] : [],
        }),
    }),
});

export const { useGetCategoriesQuery } = categoriesApi;
