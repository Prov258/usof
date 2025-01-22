import React from 'react';
import { Paginated, Post } from '../../types';
import { Center, Loader, Pagination, Stack, Text } from '@mantine/core';
import PostCard from './PostCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface PostsListsProps {
    postsData: Paginated<Post>;
    isLoading: boolean;
    isError: boolean;
    handlePageChange: (page: number) => void;
    editable: boolean;
}

export const PostsList: React.FC<PostsListsProps> = ({
    postsData: postsData,
    isLoading,
    isError,
    handlePageChange,
}) => {
    const { user } = useSelector((state: RootState) => state.auth);

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
                    Failed to load posts
                </Text>
            </Center>
        );
    }

    return (
        <>
            <Stack>
                {postsData.data.map((post: Post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        isOwner={post.author.id === user?.id}
                    />
                ))}
                <Pagination
                    m="md"
                    component={Center}
                    total={postsData.meta.pageCount}
                    value={postsData.meta.page}
                    onChange={handlePageChange}
                />
            </Stack>
        </>
    );
};
