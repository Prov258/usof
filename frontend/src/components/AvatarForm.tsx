import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { clearSuccess, uploadAvatar } from '../store/slices/authSlice';
import { useAppDispatch } from '../hooks/redux';

interface AvatarForm {
    avatar: FileList;
}

const schema = z.object({
    avatar: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, 'Avatar is required'),
});

const AvatarForm = () => {
    const { isLoading, success, error } = useSelector(
        (state: RootState) => state.auth,
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AvatarForm>({
        resolver: zodResolver(schema),
    });
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (success) {
            toast.success('Uploaded avatar successfully!');
            dispatch(clearSuccess());
        }
    }, [dispatch, success]);

    const onSubmit = async (data: AvatarForm) => {
        const formData = new FormData();
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
                {errors.avatar && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.avatar.message}
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
