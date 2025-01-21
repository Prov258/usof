import { createApi } from '@reduxjs/toolkit/query/react';
import { Comment, Like, Paginated } from '../types';
import { VoteQuery } from '../types';
import axiosBaseQuery from '../utils/axiosBaseQuery';

interface CommentsQuery {
    postId: number;
    page: number;
}

interface CreateCommentQuery {
    postId: number;
    content: string;
}

export const commentsApi = createApi({
    reducerPath: 'comments',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Comment'],
    endpoints: (builder) => ({
        getComments: builder.query<Paginated<Comment>, CommentsQuery>({
            query: ({ postId, page }) => {
                const params = new URLSearchParams({
                    ...(page && { page: page.toString() }),
                });

                return {
                    url: `/posts/${postId}/comments?${params}`,
                    method: 'GET',
                };
            },
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
