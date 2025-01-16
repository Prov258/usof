import React from 'react';
import Tabs from '../tabs/Tabs';

type TabKey = 'profile' | 'password' | 'avatar';

interface ProfileTabsProps {
    activeTab: TabKey;
    onTabChange: (tab: TabKey) => void;
}

const tabs = [
    {
        key: 'profile',
        label: 'Profile Information',
        icon: <></>,
    },
    {
        key: 'password',
        label: 'Change Password',
        icon: <></>,
    },
    {
        key: 'avatar',
        label: 'Upload Avatar',
        icon: <></>,
    },
];

const ProfileSettingsTabs: React.FC<ProfileTabsProps> = ({
    activeTab,
    onTabChange,
}) => {
    return (
        <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tab) => onTabChange(tab as TabKey)}
        />
    );
};

export default ProfileSettingsTabs;
