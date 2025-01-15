import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Like, Paginated, Post, PostFiltersType } from '../types/index';
import { VoteQuery } from '../types/index';

interface PostQuery {
    page: number;
    filters: PostFiltersType;
}

interface CreatePostData {
    title: string;
    content: string;
    categories: string[];
}

interface UpdatePostData extends CreatePostData {
    id: number;
    status?: 'active' | 'inactive';
}

export const postsApi = createApi({
    reducerPath: 'posts',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/posts',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Post'],
    endpoints: (builder) => ({
        getPosts: builder.query<Paginated<Post>, PostQuery>({
            query: ({ page, filters = {} }) => {
                const params = new URLSearchParams({
                    ...(page && { page: page.toString() }),
                    ...(filters.sortBy && { sort: filters.sortBy }),
                    ...(filters.sortOrder && { order: filters.sortOrder }),
                    ...(filters.authorId && {
                        authorId: String(filters.authorId),
                    }),
                    ...(filters.title && { title: filters.title }),
                    ...(filters.categories &&
                        filters.categories.length && {
                            categories: filters.categories.join(','),
                        }),
                });

                return `?${params}`;
            },
            providesTags: (result) =>
                result
                    ? [
                          { type: 'Post', id: 'LIST' },
                          ...result.data.map(
                              ({ id }) =>
                                  ({
                                      type: 'Post',
                                      id,
                                  }) as const,
                          ),
                      ]
                    : [{ type: 'Post', id: 'LIST' }],
        }),
        getPostById: builder.query<Post, string>({
            query: (id) => `/${id}`,
            providesTags: (result, _error, id) =>
                result ? [{ type: 'Post', id }] : [],
        }),
        createPost: builder.mutation<Post, CreatePostData>({
            query: (newPost) => ({
                url: '/',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: [{ type: 'Post', id: 'LIST' }],
        }),
        updatePost: builder.mutation<Post, UpdatePostData>({
            query: ({ id, ...post }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: post,
            }),
            invalidatesTags: (result, _error, { id }) => [{ type: 'Post', id }],
        }),
        votePost: builder.mutation<Like, VoteQuery>({
            query: ({ id, type }) => ({
                url: `/${id}/like`,
                method: type === null ? 'DELETE' : 'POST',
                body: type === null ? undefined : { type },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Post', id },
                { type: 'Post', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetPostsQuery,
    useGetPostByIdQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useVotePostMutation,
} = postsApi;
