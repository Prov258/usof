import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import UserPosts from './UserPosts';
import ProfileSettings from './ProfileSettings';

export default function Profile() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = React.useState<'posts' | 'settings'>(
        'posts',
    );
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProfileHeader user={user} />
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
                {activeTab === 'posts' ? (
                    <UserPosts userId={user.id} />
                ) : (
                    <ProfileSettings />
                )}
            </div>
        </div>
    );
}
