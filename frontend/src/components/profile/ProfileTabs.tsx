import React from 'react';
import { FileText, Settings } from 'lucide-react';
import { Tabs } from '@mantine/core';
import ProfilePosts from '../../pages/profile/ProfilePosts';
import ProfileSettings from '../../pages/profile/ProfileSettings';
import { User } from '../../types';

interface ProfileTabsProps {
    user: User;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ user }) => {
    return (
        <Tabs defaultValue="posts" radius="md">
            <Tabs.List mb="lg">
                <Tabs.Tab value="posts" leftSection={<FileText size={20} />}>
                    My Posts
                </Tabs.Tab>
                <Tabs.Tab value="settings" leftSection={<Settings size={20} />}>
                    Settings
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="posts">
                <ProfilePosts userId={user.id} />
            </Tabs.Panel>

            <Tabs.Panel value="settings">
                <ProfileSettings />
            </Tabs.Panel>
        </Tabs>
    );
};

export default ProfileTabs;
