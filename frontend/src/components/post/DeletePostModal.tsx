import React, { useEffect } from 'react';
import { Button, Group, Modal, Text } from '@mantine/core';
import { Post } from '../../types';
import toast from 'react-hot-toast';
import { useDeletePostMutation } from '../../services/postApi';

interface DeletePostModalProps {
    post: Post;
    opened: boolean;
    close: () => void;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({
    post,
    opened,
    close,
}) => {
    const [deletePost, { isSuccess, isLoading }] = useDeletePostMutation();

    const handleDelete = async () => {
        try {
            await deletePost({ id: post.id });
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success('Deleted post successfully!');
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
                Are you sure you want to delete this post?
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

export default DeletePostModal;
