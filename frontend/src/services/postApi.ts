import { createApi } from '@reduxjs/toolkit/query/react';
import { Like, Paginated, Post, PostFiltersType } from '../types/index';
import { VoteQuery } from '../types/index';
import axiosBaseQuery from '../utils/axiosBaseQuery';

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

interface DeletePostQuery {
    id: number;
}

export const postsApi = createApi({
    reducerPath: 'posts',
    baseQuery: axiosBaseQuery(),
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

                return {
                    url: `/posts/?${params}`,
                    method: 'GET',
                };
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
            query: (id) => ({
                url: `/posts/${id}`,
                method: 'GET',
            }),
            providesTags: (result, _error, id) =>
                result ? [{ type: 'Post', id }] : [],
        }),
        createPost: builder.mutation<Post, CreatePostData>({
            query: (newPost) => ({
                url: '/posts',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: [{ type: 'Post', id: 'LIST' }],
        }),
        updatePost: builder.mutation<Post, UpdatePostData>({
            query: ({ id, ...post }) => ({
                url: `/posts/${id}`,
                method: 'PATCH',
                body: post,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Post', id },
            ],
        }),
        deletePost: builder.mutation<Post, DeletePostQuery>({
            query: ({ id }) => ({
                url: `/posts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Post', id },
            ],
        }),
        votePost: builder.mutation<Like, VoteQuery>({
            query: ({ id, type }) => ({
                url: `/posts/${id}/like`,
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
    useDeletePostMutation,
    useVotePostMutation,
} = postsApi;
