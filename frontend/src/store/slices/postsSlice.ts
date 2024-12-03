import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Post } from '../../types';
import { PostFiltersType } from '../../components/PostFilters';

const API_URL = 'http://localhost:3000/api';

interface PostsState {
    posts: Post[];
    currentPost: Post | null;
    isLoading: boolean;
    error: string | null;
    success: boolean;
    totalPages: number;
    currentPage: number;
}

interface FetchPostsParams {
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

export const createPost = createAsyncThunk(
    'posts/create',
    async (postData: CreatePostData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            const { data } = await axios.post(
                `${API_URL}/posts`,
                postData,
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

export const updatePost = createAsyncThunk(
    'posts/update',
    async (postData: UpdatePostData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            };
            const { id, ...data } = postData;
            const response = await axios.patch(
                `${API_URL}/posts/${id}`,
                data,
                config,
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

export const fetchPosts = createAsyncThunk(
    'posts/fetchAll',
    async ({ page, filters }: FetchPostsParams) => {
        const params = new URLSearchParams({
            ...(page && { page: page.toString() }),
            ...(filters.sortBy && { sort: filters.sortBy }),
            ...(filters.sortOrder && { order: filters.sortOrder }),
            ...(filters.authorId && { authorId: String(filters.authorId) }),
            ...(filters.search && { search: filters.search }),
            ...(filters.title && { title: filters.title }),
            ...(filters.categories &&
                filters.categories.length && {
                    categories: filters.categories.join(','),
                }),
        });
        const response = await axios.get(`${API_URL}/posts?${params}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    },
);

export const fetchPostById = createAsyncThunk(
    'posts/fetchById',
    async (id: number) => {
        const response = await axios.get(`${API_URL}/posts/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    },
);

export const votePost = createAsyncThunk(
    'posts/vote',
    async ({
        id,
        voteType,
    }: {
        id: number;
        voteType: 'LIKE' | 'DISLIKE' | null;
    }) => {
        if (voteType === null) {
            const response = await axios.delete(`${API_URL}/posts/${id}/like`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return { ...response.data, type: null };
        }

        const response = await axios.post(
            `${API_URL}/posts/${id}/like`,
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

const initialState: PostsState = {
    posts: [],
    currentPost: null,
    isLoading: false,
    error: null,
    success: false,
    totalPages: 1,
    currentPage: 1,
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        clearCurrentPost: (state) => {
            state.currentPost = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.success = true;
                state.isLoading = false;
                state.posts.unshift(action.payload);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to create post';
            })
            .addCase(updatePost.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.success = true;
                state.isLoading = false;
                state.posts.map((p) =>
                    p.id === action.payload.id ? action.payload : p,
                );
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to create post';
            })
            .addCase(fetchPosts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload.data;
                state.totalPages = action.payload.meta.pageCount;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch posts';
            })
            .addCase(fetchPostById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentPost = action.payload;
            })
            .addCase(fetchPostById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch post';
            })
            .addCase(votePost.fulfilled, (state, action) => {
                if (state.currentPost?.id === action.payload.post.id) {
                    state.currentPost = {
                        ...state.currentPost,
                        rating: action.payload.post.rating,
                        likes: [action.payload],
                    };
                }

                state.posts = state.posts.map((post) =>
                    post.id === action.payload.postId
                        ? {
                              ...post,
                              rating: action.payload.post.rating,
                              likes: [action.payload],
                          }
                        : post,
                );
            });
    },
});

export const { clearCurrentPost, clearSuccess, setCurrentPage } =
    postsSlice.actions;
export default postsSlice.reducer;
