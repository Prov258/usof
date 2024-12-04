import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import type { Comment } from '../../types';

interface CommentsState {
    comments: Comment[];
    isLoading: boolean;
    error: string | null;
}

export const fetchCommentsForPost = createAsyncThunk(
    'comments/fetchForPost',
    async (postId: number) => {
        const response = await axios.get(`/posts/${postId}/comments`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    },
);

export const createComment = createAsyncThunk(
    'comments/create',
    async (
        commentData: {
            postId: number;
            content: string;
        },
        { rejectWithValue },
    ) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            const { data } = await axios.post(
                `/posts/${commentData.postId}/comments`,
                { content: commentData.content },
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

export const voteComment = createAsyncThunk(
    'comments/vote',
    async ({
        id,
        voteType,
    }: {
        id: number;
        voteType: 'LIKE' | 'DISLIKE' | null;
    }) => {
        if (voteType === null) {
            const response = await axios.delete(`/comments/${id}/like`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return { ...response.data, type: null };
        }

        const response = await axios.post(
            `/comments/${id}/like`,
            { type: voteType },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            },
        );
        return response.data;
    },
);

const initialState: CommentsState = {
    comments: [],
    isLoading: false,
    error: null,
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommentsForPost.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCommentsForPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments = action.payload.data;
            })
            .addCase(fetchCommentsForPost.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || 'Failed to fetch comments';
            })
            .addCase(createComment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments.unshift(action.payload);
            })
            .addCase(createComment.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    action.error.message || 'Failed to create comment';
            })
            .addCase(voteComment.fulfilled, (state, action) => {
                state.comments = state.comments.map((comment) =>
                    comment.id === action.payload.comment.id
                        ? {
                              ...comment,
                              rating: action.payload.comment.rating,
                              likes: [action.payload],
                          }
                        : comment,
                );
            });
    },
});

export default commentsSlice.reducer;
