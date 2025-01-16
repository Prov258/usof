import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileTabs from '../../components/profile/ProfileTabs';
import ProfilePosts from './ProfilePosts';
import ProfileSettings from './ProfileSettings';

const Profile = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = React.useState<'posts' | 'settings'>(
        'posts',
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [navigate, user]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProfileHeader user={user} />
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-6">
                {activeTab === 'posts' ? (
                    <ProfilePosts userId={user.id} />
                ) : (
                    <ProfileSettings />
                )}
            </div>
        </div>
    );
};

export default Profile;
