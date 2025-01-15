import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import CategorySelect from '../../components/CategorySelect';
import type { RootState } from '../../store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Spinner from '../../components/Spinner';
import {
    useGetPostByIdQuery,
    useUpdatePostMutation,
} from '../../services/postApi';
import FormArea from '../../components/form/FormArea';
import FormInput from '../../components/form/FormInput';

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

const EditPost = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [updatePost, { isLoading: isUpdating, isSuccess, error }] =
        useUpdatePostMutation();
    const { data: currentPost, isLoading } = useGetPostByIdQuery(id);

    const navigate = useNavigate();

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
        if (currentPost) {
            reset({
                title: currentPost.title,
                content: currentPost.content,
                categories: currentPost.categories.map((c) => c.category.title),
            });
        }
    }, [currentPost, reset]);

    useEffect(() => {
        if (isSuccess) {
            toast.success('Edited post successfully!');
        }
    }, [isSuccess]);

    const onSubmit = async (data: EditPostForm) => {
        await updatePost({ id: currentPost.id, ...data });
    };

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

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Edit Post
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormInput
                        name={'title'}
                        type={'text'}
                        label={'Title'}
                        register={register}
                        errors={errors}
                    />

                    <FormArea
                        name={'content'}
                        label={'Content'}
                        rows={10}
                        placeholder={
                            'Include all the information someone would need to answer your question'
                        }
                        register={register}
                        errors={errors}
                    />

                    <CategorySelect
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
                            {error.data}
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
                            disabled={isUpdating}
                            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;
