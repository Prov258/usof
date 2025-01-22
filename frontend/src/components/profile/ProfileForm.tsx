import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { resetStatus, updateProfile } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../hooks/redux';
import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { Mail, User } from 'lucide-react';

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
            dispatch(resetStatus());
        }
    }, [dispatch, success]);

    useEffect(() => {
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch]);

    const onProfileSubmit = async (data: ProfileForm) => {
        dispatch(updateProfile({ id: user?.id, ...data }));
    };

    return (
        <form onSubmit={handleSubmit(onProfileSubmit)}>
            <Stack>
                <TextInput
                    {...register('login')}
                    label="Login"
                    placeholder="Choose a login"
                    error={errors.login?.message}
                    leftSection={<User size={16} />}
                    required
                />
                <TextInput
                    {...register('fullName')}
                    label="Full Name"
                    placeholder="John Doe"
                    leftSection={<User size={16} />}
                    error={errors.fullName?.message}
                    required
                />
                <TextInput
                    {...register('email')}
                    label="Email"
                    placeholder="your@email.com"
                    leftSection={<Mail size={16} />}
                    error={errors.email?.message}
                    required
                />

                {error && <Text c="red">{error}</Text>}

                <Group justify="flex-end">
                    <Button type="submit" disabled={isLoading} mt="md">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Group>
            </Stack>
        </form>
    );
};

export default ProfileForm;
