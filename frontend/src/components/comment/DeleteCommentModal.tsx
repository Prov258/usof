import React, { useEffect } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';
import { Comment } from '../../types';
import { useDeleteCommentMutation } from '../../services/commentApi';
import toast from 'react-hot-toast';

interface DeleteCommentModalProps {
    comment: Comment;
    opened: boolean;
    close: () => void;
}

const DeleteCommentModal: React.FC<DeleteCommentModalProps> = ({
    comment,
    opened,
    close,
}) => {
    const [deleteComment, { isSuccess, isLoading }] =
        useDeleteCommentMutation();

    const handleDelete = async () => {
        try {
            await deleteComment({ id: comment.id });
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success('Deleted comment successfully!');
        }
    }, [isSuccess]);

    return (
        <Modal
            opened={opened}
            onClose={close}
            size="lg"
            withCloseButton={false}
            centered
        >
            <Text size="lg" fw={600}>
                Are you sure you want to delete this comment?
            </Text>

            <Group justify="flex-end" mt="md">
                <Button variant="light" onClick={close}>
                    Cancel
                </Button>

                <Button
                    type="submit"
                    color="red"
                    disabled={isLoading}
                    onClick={handleDelete}
                >
                    {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
            </Group>
        </Modal>
    );
};

export default DeleteCommentModal;
