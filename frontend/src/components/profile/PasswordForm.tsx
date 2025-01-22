import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { resetStatus, updateProfile } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../hooks/redux';
import { Button, Group, PasswordInput, Stack, Text } from '@mantine/core';
import { Lock } from 'lucide-react';

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
            toast.success('Reseted password successfully!');
            dispatch(resetStatus());
        }
    }, [dispatch, success]);

    useEffect(() => {
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch]);

    const onPasswordSubmit = async (data: PasswordForm) => {
        dispatch(
            updateProfile({
                id: user?.id,
                password: data.newPassword,
            }),
        );
    };

    return (
        <form onSubmit={handleSubmit(onPasswordSubmit)}>
            <Stack>
                <PasswordInput
                    {...register('oldPassword')}
                    label="Current password"
                    placeholder="Your current password"
                    leftSection={<Lock size={16} />}
                    required
                />
                <PasswordInput
                    {...register('newPassword')}
                    label="Password"
                    placeholder="New password"
                    leftSection={<Lock size={16} />}
                    required
                />
                <PasswordInput
                    {...register('confirmPassword')}
                    label="Confirm Password"
                    placeholder="Confirm your new password"
                    error={errors.confirmPassword?.message}
                    leftSection={<Lock size={16} />}
                    required
                />

                {error && <Text c="red">{error}</Text>}

                <Group justify="flex-end">
                    <Button type="submit" disabled={isLoading} mt="md">
                        {isLoading ? 'Changing Password...' : 'Change Password'}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
};

export default PasswordForm;
