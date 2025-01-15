import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCommentMutation } from '../../services/commentApi';

interface CommentFormProps {
    postId: number;
}

interface CommentFormData {
    content: string;
}

const schema = z.object({
    content: z.string().min(1, 'Content is required'),
});

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
    const [addComment] = useCreateCommentMutation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CommentFormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: CommentFormData) => {
        try {
            await addComment({ postId, content: data.content });
            reset();
        } catch (error) {
            console.error('Failed to submit comment:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <textarea
                    {...register('content')}
                    rows={6}
                    className="block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Write your answer here..."
                />
                {errors.content && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.content.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                {isSubmitting ? 'Posting...' : 'Post Your Answer'}
            </button>
        </form>
    );
};

export default CommentForm;
