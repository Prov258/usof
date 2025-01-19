import { useState } from 'react';
import ProfileForm from '../../components/profile/ProfileForm';
import PasswordForm from '../../components/profile/PasswordForm';
import AvatarForm from '../../components/profile/AvatarForm';
import ProfileSettingsTabs from '../../components/profile/ProfileSettingsTabs';

const ProfileSettings = () => {
    const [activeTab, setActiveTab] = useState<
        'profile' | 'password' | 'avatar'
    >('profile');

    return (
        <div className="bg-white rounded-lg shadow-sm px-4">
            <ProfileSettingsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className="p-6">
                {activeTab === 'profile' ? (
                    <ProfileForm />
                ) : activeTab === 'password' ? (
                    <PasswordForm />
                ) : (
                    <AvatarForm />
                )}
            </div>
        </div>
    );
};

export default ProfileSettings;
