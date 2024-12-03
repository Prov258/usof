import { FileText, Settings } from 'lucide-react';

interface ProfileTabsProps {
    activeTab: 'posts' | 'settings';
    onTabChange: (tab: 'posts' | 'settings') => void;
}

export default function ProfileTabs({
    activeTab,
    onTabChange,
}: ProfileTabsProps) {
    return (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
                <button
                    onClick={() => onTabChange('posts')}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'posts'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    <FileText className="h-5 w-5" />
                    <span>My Posts</span>
                </button>

                <button
                    onClick={() => onTabChange('settings')}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'settings'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                </button>
            </nav>
        </div>
    );
}
