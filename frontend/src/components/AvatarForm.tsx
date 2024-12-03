import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { clearSuccess, uploadAvatar } from '../store/slices/authSlice';

interface AvatarForm {
    avatar: string;
}

const schema = z.object({
    avatar: z.any(),
});

const AvatarForm = () => {
    const dispatch = useDispatch();
    const { user, isLoading, success, error } = useSelector(
        (state: RootState) => state.auth,
    );

    const {
        register,
        handleSubmit,
        formState: { errors: profileErrors },
    } = useForm<AvatarForm>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (success) {
            toast.success('Uploaded avatar successfully!');
            dispatch(clearSuccess());
        }
    }, [dispatch, success]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        console.log(data.avatar[0]);
        formData.append('avatar', data.avatar[0]);
        dispatch(uploadAvatar(formData));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label
                    htmlFor="avatar"
                    className="block text-sm font-medium text-gray-700"
                >
                    Avatar
                </label>
                <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    {...register('avatar')}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {profileErrors.avatar && (
                    <p className="mt-1 text-sm text-red-600">
                        {profileErrors.avatar.message}
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

export default AvatarForm;
