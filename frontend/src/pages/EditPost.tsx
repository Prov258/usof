import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
    clearSuccess,
    fetchPost,
    fetchPostById,
    updatePost,
} from '../store/slices/postsSlice';
import CategorySelect from '../components/CategorySelect';
import type { RootState } from '../store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchCategories } from '../store/slices/categoriesSlice';
import Spinner from '../components/Spinner';
import Select from 'react-select';

interface EditPostForm {
    title: string;
    content: string;
    categories: string[];
    status: 'active' | 'inactive';
}

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    categories: z.array(z.any()),
});

export default function EditPost() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentPost, isLoading, error, success } = useSelector(
        (state: RootState) => state.posts,
    );
    const { categories } = useSelector((state: RootState) => state.categories);
    const { user } = useSelector((state: RootState) => state.auth);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<EditPostForm>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(fetchPostById(parseInt(id)));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (currentPost) {
            reset({
                title: currentPost.title,
                content: currentPost.content,
                categories: currentPost.categories.map((c) => c.category.title),
            });
        }
    }, [currentPost, reset]);

    useEffect(() => {
        if (success) {
            toast.success('Edited post successfully!');
            dispatch(clearSuccess());
        }
    }, [dispatch, success]);

    if (isLoading) {
        return <Spinner />;
    }

    if (!currentPost || !user || currentPost.author.id !== user.id) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">
                    You don't have permission to edit this post
                </h2>
            </div>
        );
    }

    const onSubmit = async (data: EditPostForm) => {
        await dispatch(
            updatePost({
                id: currentPost.id,
                ...data,
            }),
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Edit Post
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            {...register('title')}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="content"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Content
                        </label>
                        <textarea
                            id="content"
                            rows={10}
                            {...register('content')}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.content.message}
                            </p>
                        )}
                    </div>

                    <CategorySelect
                        categories={categories}
                        selectedCategories={currentPost.categories}
                        control={control}
                        error={errors.categories?.message}
                    />

                    {/* <div>
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Status
                        </label>
                        <select
                            id="status"
                            {...register('status')}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div> */}

                    {error && (
                        <div className="text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/posts/${currentPost.id}`)}
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
