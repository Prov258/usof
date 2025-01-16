import React from 'react';
import { FileText, Settings } from 'lucide-react';
import Tabs from '../tabs/Tabs';

type TabKey = 'posts' | 'settings';

interface ProfileTabsProps {
    activeTab: TabKey;
    onTabChange: (tab: TabKey) => void;
}

const tabs = [
    {
        key: 'posts',
        label: 'My Posts',
        icon: <FileText className="h-5 w-5" />,
    },
    {
        key: 'settings',
        label: 'Settings',
        icon: <Settings className="h-5 w-5" />,
    },
];

const ProfileTabs: React.FC<ProfileTabsProps> = ({
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

export default ProfileTabs;
