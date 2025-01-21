import React from 'react';
import { Comment } from '../../types';
import VoteButtons from '../form/VoteButtons';
import { url } from '../../utils/funcs';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, Card, Divider, Group, Stack, Text } from '@mantine/core';

interface CommentProps {
    comment: Comment;
}

const CommentCard: React.FC<CommentProps> = ({ comment }) => {
    return (
        <Card>
            <Group align="start" wrap="nowrap">
                <VoteButtons
                    type={'comment'}
                    id={comment.id}
                    rating={comment.rating}
                    userVote={comment?.likes}
                />

                <Stack style={{ flexGrow: 1 }} pt="sm">
                    <Text style={{ flexGrow: 1 }}>{comment.content}</Text>

                    <Group mt="xs" justify="space-between">
                        <Group gap="xs">
                            <Avatar
                                radius="xl"
                                size="md"
                                src={url(comment.author.avatar)}
                                alt={comment.author.login}
                            />
                            <Text c="gray">{comment.author.login}</Text>
                        </Group>
                        <Group gap="xs" c="gray">
                            <Clock className="h-4 w-4" />
                            <Text>
                                {formatDistanceToNow(
                                    new Date(comment.createdAt),
                                )}{' '}
                                ago
                            </Text>
                        </Group>
                    </Group>
                </Stack>
            </Group>
            <Divider mt="lg" />
        </Card>
    );
};

export default CommentCard;
