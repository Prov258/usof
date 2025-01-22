import React from 'react';
import { Comment } from '../../types';
import VoteButtons from '../form/VoteButtons';
import { url } from '../../utils/funcs';
import { Clock, Edit, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
    ActionIcon,
    Avatar,
    Card,
    Divider,
    Group,
    Stack,
    Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import EditCommentModal from './EditCommentModal';
import DeleteCommentModal from './DeleteCommentModal';

interface CommentProps {
    comment: Comment;
    isOwner: boolean;
}

const CommentCard: React.FC<CommentProps> = ({ comment, isOwner }) => {
    const [openedEditForm, { open: openEditForm, close: closeEditForm }] =
        useDisclosure(false);
    const [openedDeleteForm, { open: openDeleteForm, close: closeDeleteForm }] =
        useDisclosure(false);

    return (
        <Card>
            <Group align="start" wrap="nowrap">
                <VoteButtons
                    type={'comment'}
                    id={comment.id}
                    rating={comment.rating}
                    userVote={comment?.likes}
                />

                <Stack style={{ flexGrow: 1 }}>
                    <Group>
                        <Group w="100%" justify="space-between">
                            <Group gap="xs">
                                <Avatar
                                    radius="xl"
                                    size="md"
                                    src={url(comment.author.avatar)}
                                    alt={comment.author.login}
                                />
                                <Text fw={500}>{comment.author.login}</Text>
                                <Group gap={5} c="gray">
                                    <Clock size={15} />
                                    <Text size="sm">
                                        {formatDistanceToNow(
                                            new Date(comment.createdAt),
                                        )}{' '}
                                        ago
                                    </Text>
                                </Group>
                            </Group>
                            {isOwner && (
                                <Group>
                                    <ActionIcon
                                        variant="subtle"
                                        color="blue"
                                        onClick={openEditForm}
                                    >
                                        <Edit size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        onClick={openDeleteForm}
                                    >
                                        <Trash size={16} />
                                    </ActionIcon>
                                </Group>
                            )}
                        </Group>
                    </Group>
                    <Text style={{ flexGrow: 1 }}>{comment.content}</Text>
                </Stack>
            </Group>
            <Divider mt="lg" />
            <EditCommentModal
                comment={comment}
                opened={openedEditForm}
                close={closeEditForm}
            />
            <DeleteCommentModal
                comment={comment}
                opened={openedDeleteForm}
                close={closeDeleteForm}
            />
        </Card>
    );
};

export default CommentCard;
