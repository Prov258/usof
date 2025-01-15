import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { postsApi } from '../services/postApi';
import { commentsApi } from '../services/commentApi';
import { categoriesApi } from '../services/categoryApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [postsApi.reducerPath]: postsApi.reducer,
        [commentsApi.reducerPath]: commentsApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(postsApi.middleware)
            .concat(commentsApi.middleware)
            .concat(categoriesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
