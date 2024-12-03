import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { clearSuccess, updateProfile } from '../store/slices/authSlice';

interface ProfileForm {
    fullName: string;
    email: string;
    login: string;
}

const profileSchema = z.object({
    email: z.string().email('Invalid email address'),
    fullName: z.string().min(1, 'Full Name is required'),
    login: z.string().min(1, 'Login is required'),
});

const ProfileForm = () => {
    const dispatch = useDispatch();
    const { user, isLoading, success, error } = useSelector(
        (state: RootState) => state.auth,
    );

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
    } = useForm<ProfileForm>({
        defaultValues: {
            fullName: user?.fullName || '',
            email: user?.email || '',
            login: user?.login || '',
        },
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (success) {
            toast.success('Edited profile successfully!');
            dispatch(clearSuccess());
        }
    }, [dispatch, success]);

    const onProfileSubmit = async (data: ProfileForm) => {
        dispatch(updateProfile({ id: user.id, ...data }));
    };

    return (
        <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-6"
        >
            <div>
                <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                >
                    Full Name
                </label>
                <input
                    type="text"
                    id="fullName"
                    {...registerProfile('fullName')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {profileErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                        {profileErrors.fullName.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    {...registerProfile('email')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                        {profileErrors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="login"
                    className="block text-sm font-medium text-gray-700"
                >
                    Login
                </label>
                <input
                    type="text"
                    id="login"
                    {...registerProfile('login')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {profileErrors.login && (
                    <p className="mt-1 text-sm text-red-600">
                        {profileErrors.login.message}
                    </p>
                )}
            </div>

            {error && (
                <div className="text-sm text-red-600 text-center">{error}</div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

export default ProfileForm;
