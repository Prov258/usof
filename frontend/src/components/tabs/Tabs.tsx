import React from 'react';
import TabButton from './TabButton';

interface Tab {
    key: string;
    label: string;
    icon: React.ReactNode;
}

interface TabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                    <TabButton
                        key={tab.key}
                        isActive={activeTab === tab.key}
                        onClick={() => onTabChange(tab.key)}
                        icon={tab.icon}
                        label={tab.label}
                    />
                ))}
            </nav>
        </div>
    );
};

export default Tabs;
