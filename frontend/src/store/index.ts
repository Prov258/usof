import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postsReducer from './slices/postsSlice';
import categoriesReducer from './slices/categoriesSlice';
import commentsReducer from './slices/commentsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postsReducer,
        categories: categoriesReducer,
        comments: commentsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
