import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { clearSuccess, updateProfile } from '../store/slices/authSlice';

interface PasswordForm {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const passwordSchema = z
    .object({
        oldPassword: z.string().min(1, 'Password is required'),
        confirmPassword: z.string().min(1, 'Password Confirm is required'),
        newPassword: z.string().min(1, 'New is required'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

const PasswordForm = () => {
    const dispatch = useDispatch();
    const { user, isLoading, success, error } = useSelector(
        (state: RootState) => state.auth,
    );

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
    } = useForm<PasswordForm>({
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        resolver: zodResolver(passwordSchema),
    });

    useEffect(() => {
        if (success) {
            toast.success('Changed password successfully!');
            dispatch(clearSuccess());
        }
    }, [dispatch, success]);

    const onPasswordSubmit = async (data: PasswordForm) => {
        dispatch(
            updateProfile({
                id: user.id,
                password: data.newPassword,
            }),
        );
    };

    return (
        <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-6"
        >
            <div>
                <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-gray-700"
                >
                    Current Password
                </label>
                <input
                    type="password"
                    id="oldPassword"
                    {...registerPassword('oldPassword')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {passwordErrors.oldPassword && (
                    <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.oldPassword.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                >
                    New Password
                </label>
                <input
                    type="password"
                    id="newPassword"
                    {...registerPassword('newPassword')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.newPassword.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                >
                    Confirm New Password
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    {...registerPassword('confirmPassword')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                        {passwordErrors.confirmPassword.message}
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
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                </button>
            </div>
        </form>
    );
};

export default PasswordForm;
