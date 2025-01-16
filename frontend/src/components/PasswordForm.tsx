import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { clearSuccess, updateProfile } from '../store/slices/authSlice';
import FormInput from './form/FormInput';
import { useAppDispatch } from '../hooks/redux';

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
    const { user, isLoading, success, error } = useSelector(
        (state: RootState) => state.auth,
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordForm>({
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        resolver: zodResolver(passwordSchema),
    });
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (success) {
            toast.success('Changed password successfully!');
            dispatch(clearSuccess());
        }
    }, [dispatch, success]);

    const onPasswordSubmit = async (data: PasswordForm) => {
        dispatch(
            updateProfile({
                id: user?.id,
                password: data.newPassword,
            }),
        );
    };

    return (
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
            <FormInput
                name={'oldPassword'}
                type={'password'}
                label={'Current Password'}
                register={register}
                errors={errors}
            />
            <FormInput
                name={'newPassword'}
                type={'password'}
                label={'New Password'}
                register={register}
                errors={errors}
            />
            <FormInput
                name={'confirmPassword'}
                type={'password'}
                label={'Confirm New Password'}
                register={register}
                errors={errors}
            />

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
