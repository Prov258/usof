import React from 'react';
import { User } from '../../types';
import { ThumbsUp } from 'lucide-react';
import { url } from '../../utils/funcs';
import { Avatar, Group, Paper, Stack, Text, Title } from '@mantine/core';

interface ProfileHeaderProps {
    user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
    return (
        <Paper withBorder p="lg" radius="md" mb="md">
            <Group>
                <Avatar size="xl" src={url(user.avatar)} alt={user.login} />

                <Stack style={{ flexGrow: 1 }} gap="xs" justify="center">
                    <Title order={3}>{user.fullName}</Title>
                    <Text c="gray">@{user.login}</Text>

                    <Group>
                        <Group gap={8}>
                            <ThumbsUp size={20} color="gray" />
                            <Text c="dark" fw={600}>
                                {user.rating}
                            </Text>
                            <Text c="gray">rating</Text>
                        </Group>
                    </Group>
                </Stack>
            </Group>
        </Paper>
    );
};

export default ProfileHeader;
