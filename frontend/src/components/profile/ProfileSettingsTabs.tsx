import React from 'react';
import { FileText, Settings } from 'lucide-react';
import Tabs from '../tabs/Tabs';

interface ProfileTabsProps {
    activeTab: 'profile' | 'password' | 'avatar';
    onTabChange: (tab: 'profile' | 'password' | 'avatar') => void;
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
    return <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />;
};

export default ProfileSettingsTabs;
