import React from 'react';

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const TabButton: React.FC<TabButtonProps> = ({
    isActive,
    onClick,
    icon,
    label,
}) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

export default TabButton;
