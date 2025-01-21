import React from 'react';
import { Post } from '../../types';
import { Avatar, Badge, Card, Group, Stack, Text } from '@mantine/core';
import VoteButtons from '../form/VoteButtons';
import { Link } from 'react-router-dom';
import { url } from '../../utils/funcs';
import { Clock, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
    post: Post;
    editable: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, editable }) => {
    return (
        <Card padding="lg" withBorder>
            <Group align="start" wrap="nowrap">
                <VoteButtons
                    type={'post'}
                    id={post.id}
                    rating={post.rating}
                    userVote={post?.likes}
                />
                <Stack style={{ flexGrow: 1 }} gap="xs">
                    <Group justify="space-between">
                        <Link to={`/posts/${post.id}`} className="block">
                            <Text fw={600} size="xl">
                                {post.title}
                            </Text>
                        </Link>
                        {editable && (
                            <Link
                                to={`/posts/${post.id}/edit`}
                                className="flex items-center text-gray-500 hover:text-indigo-600"
                            >
                                <Edit className="h-5 w-5" />
                            </Link>
                        )}
                    </Group>

                    <Text c="dark">{post.content}</Text>

                    <Group gap="xs">
                        {post.categories.map((category) => (
                            <Badge key={category.id}>{category.title}</Badge>
                        ))}
                    </Group>

                    <Group mt="xs" justify="space-between">
                        <Group gap="xs">
                            <Avatar
                                radius="xl"
                                size="md"
                                src={url(post.author.avatar)}
                                alt={post.author.login}
                            />
                            <Text c="gray">{post.author.login}</Text>
                        </Group>
                        <Group gap="xs" c="gray">
                            <Clock className="h-4 w-4" />
                            <Text>
                                {formatDistanceToNow(new Date(post.createdAt))}{' '}
                                ago
                            </Text>
                        </Group>
                    </Group>
                </Stack>
            </Group>
        </Card>
    );
};

export default PostCard;
