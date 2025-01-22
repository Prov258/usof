import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import CommentForm from '../../components/comment/CommentForm';
import CommentsList from '../../components/comment/CommentsList';
import { useGetPostByIdQuery } from '../../services/postApi';
import {
    Center,
    Container,
    Divider,
    Loader,
    Paper,
    Stack,
    Text,
} from '@mantine/core';
import PostCard from '../../components/post/PostCard';

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: post, isLoading, isError } = useGetPostByIdQuery(id ?? '');
    const { user } = useSelector((state: RootState) => state.auth);

    if (isLoading) {
        return (
            <Center h="200">
                <Loader color="blue" size="lg" />
            </Center>
        );
    }

    if (isError || !post) {
        return (
            <Center h="200">
                <Text c="red" size="xl" fw={700}>
                    Post not found
                </Text>
            </Center>
        );
    }

    return (
        <Container size="md">
            <PostCard post={post} isOwner={post.author.id === user?.id} />

            <Paper mt="xl" p="xl" withBorder>
                {user && (
                    <Stack mb="lg">
                        <CommentForm postId={post.id} />
                        <Divider mt="xs" />
                    </Stack>
                )}

                <CommentsList postId={post.id} />
            </Paper>
        </Container>
    );
};

export default PostDetail;
