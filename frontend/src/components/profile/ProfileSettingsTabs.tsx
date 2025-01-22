import { Tabs } from '@mantine/core';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import AvatarForm from './AvatarForm';

const ProfileSettingsTabs = () => {
    return (
        <Tabs keepMounted={false} defaultValue="profile" radius="md">
            <Tabs.List mb="xl">
                <Tabs.Tab value="profile">Profile Information</Tabs.Tab>
                <Tabs.Tab value="password">Change Password</Tabs.Tab>
                <Tabs.Tab value="avatar">Upload Avatar</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="profile">
                <ProfileForm />
            </Tabs.Panel>

            <Tabs.Panel value="password">
                <PasswordForm />
            </Tabs.Panel>

            <Tabs.Panel value="avatar">
                <AvatarForm />
            </Tabs.Panel>
        </Tabs>
    );
};

export default ProfileSettingsTabs;
