import React, { useEffect } from 'react';
import { Button, Group, Modal, Stack, Textarea } from '@mantine/core';
import { Comment } from '../../types';
import { useUpdateCommentMutation } from '../../services/commentApi';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CommentFormData } from './CommentForm';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

interface EditCommentModalProps {
    comment: Comment;
    opened: boolean;
    close: () => void;
}

const schema = z.object({
    content: z.string().min(1, 'Content is required'),
});

const EditCommentModal: React.FC<EditCommentModalProps> = ({
    comment,
    opened,
    close,
}) => {
    const [updateComment, { isSuccess }] = useUpdateCommentMutation();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CommentFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            content: comment.content,
        },
    });

    const onSubmit = async (data: CommentFormData) => {
        try {
            await updateComment({ id: comment.id, content: data.content });
        } catch (error) {
            console.error('Failed to submit comment:', error);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success('Edited comment successfully!');
        }
    }, [isSuccess]);

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="Edit Comment"
            size="lg"
            centered
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
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

                    <Group justify="flex-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            mt="md"
                            radius="md"
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};

export default EditCommentModal;
