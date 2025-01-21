import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCommentMutation } from '../../services/commentApi';
import { Button, Textarea } from '@mantine/core';

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
        <form onSubmit={handleSubmit(onSubmit)}>
            <Textarea
                {...register('content')}
                error={errors.content?.message}
                size="md"
                radius="md"
                withAsterisk
                placeholder="Write your comment here..."
                autosize
                minRows={4}
                maxRows={8}
                required
            />

            <Button type="submit" disabled={isSubmitting} mt="md" radius="md">
                {isSubmitting ? 'Posting...' : 'Post Your Comment'}
            </Button>
        </form>
    );
};

export default CommentForm;
