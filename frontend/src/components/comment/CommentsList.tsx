import React, { useState } from 'react';
import { useGetCommentsQuery } from '../../services/commentApi';
import CommentCard from './CommentCard';
import { Center, Loader, Pagination, Stack, Text, Title } from '@mantine/core';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface CommentsListProps {
    postId: number;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { user } = useSelector((state: RootState) => state.auth);
    const {
        data: commentsData,
        isLoading,
        isError,
    } = useGetCommentsQuery({ postId, page: currentPage });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (isLoading) {
        return (
            <Center h="200">
                <Loader color="blue" size="lg" />
            </Center>
        );
    }

    if (isError) {
        return (
            <Center h="200">
                <Text c="red" size="xl" fw={700}>
                    Failed to load comments
                </Text>
            </Center>
        );
    }

    return (
        <Stack>
            <Title order={3}>Comments ({commentsData?.meta.itemCount})</Title>
            <Stack gap={0}>
                {commentsData?.data.map((comment) => (
                    <CommentCard
                        key={comment.id}
                        comment={comment}
                        isOwner={comment.author.id === user?.id}
                    />
                ))}
                <Pagination
                    m="md"
                    component={Center}
                    total={commentsData?.meta.pageCount || 0}
                    value={commentsData?.meta.page}
                    onChange={handlePageChange}
                />
            </Stack>
        </Stack>
    );
};

export default CommentsList;
