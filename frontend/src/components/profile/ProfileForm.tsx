import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { clearSuccess, updateProfile } from '../../store/slices/authSlice';
import FormInput from '../form/FormInput';
import { useAppDispatch } from '../../hooks/redux';

export interface ProfileForm {
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
    const { user, isLoading, success, error } = useSelector(
        (state: RootState) => state.auth,
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileForm>({
        defaultValues: {
            fullName: user?.fullName || '',
            email: user?.email || '',
            login: user?.login || '',
        },
        resolver: zodResolver(profileSchema),
    });
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (success) {
            toast.success('Edited profile successfully!');
            dispatch(clearSuccess());
        }
    }, [dispatch, success]);

    const onProfileSubmit = async (data: ProfileForm) => {
        dispatch(updateProfile({ id: user?.id, ...data }));
    };

    return (
        <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
            <FormInput
                name={'fullName'}
                type={'text'}
                label={'Full Name'}
                register={register}
                errors={errors}
            />
            <FormInput
                name={'email'}
                type={'email'}
                label={'Email'}
                register={register}
                errors={errors}
            />
            <FormInput
                name={'login'}
                type={'text'}
                label={'Login'}
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
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

export default ProfileForm;
