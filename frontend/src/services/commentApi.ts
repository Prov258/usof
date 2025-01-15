import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Comment, Like, Paginated } from '../types';
import { VoteQuery } from '../types';

interface CreateCommentQuery {
    postId: number;
    content: string;
}

export const commentsApi = createApi({
    reducerPath: 'comments',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Comment'],
    endpoints: (builder) => ({
        getComments: builder.query<Paginated<Comment>, number>({
            query: (postId: number) => `/posts/${postId}/comments`,
            providesTags: (result) =>
                result ? [{ type: 'Comment', id: 'LIST' }] : [],
        }),
        createComment: builder.mutation<Comment, CreateCommentQuery>({
            query: ({ postId, content }) => ({
                url: `/posts/${postId}/comments`,
                method: 'POST',
                body: { content },
            }),
            invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
        }),
        voteComment: builder.mutation<Like, VoteQuery>({
            query: ({ id, type }) => ({
                url: `/comments/${id}/like`,
                method: type === null ? 'DELETE' : 'POST',
                body: type === null ? undefined : { type },
            }),
            invalidatesTags: [{ type: 'Comment', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetCommentsQuery,
    useCreateCommentMutation,
    useVoteCommentMutation,
} = commentsApi;
