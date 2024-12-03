import { useState } from 'react';
import ProfileForm from '../../components/ProfileForm';
import PasswordForm from '../../components/PasswordForm';
import AvatarForm from '../../components/AvatarForm';

export default function ProfileSettings() {
    const [activeSection, setActiveSection] = useState<
        'profile' | 'password' | 'avatar'
    >('profile');

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                    <button
                        onClick={() => setActiveSection('profile')}
                        className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                            activeSection === 'profile'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Profile Information
                    </button>
                    <button
                        onClick={() => setActiveSection('password')}
                        className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                            activeSection === 'password'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Change Password
                    </button>
                    <button
                        onClick={() => setActiveSection('avatar')}
                        className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                            activeSection === 'avatar'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Upload Avatar
                    </button>
                </nav>
            </div>

            <div className="p-6">
                {activeSection === 'profile' ? (
                    <ProfileForm />
                ) : activeSection === 'password' ? (
                    <PasswordForm />
                ) : (
                    <AvatarForm />
                )}
            </div>
        </div>
    );
}
