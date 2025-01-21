import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/redux';
import {
    Button,
    Container,
    Paper,
    PasswordInput,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { Lock } from 'lucide-react';

export interface PasswordResetForm {
    password: string;
    confirmPassword: string;
}

const schema = z
    .object({
        password: z.string().min(1, 'Password is required'),
        confirmPassword: z.string().min(1, 'Confirm Password is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

const PasswordReset = () => {
    const { token } = useParams<{ token: string }>();
    const { success, isLoading, user, error } = useSelector(
        (state: RootState) => state.auth,
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordResetForm>({
        resolver: zodResolver(schema),
    });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [navigate, user]);

    const onSubmit = (data: PasswordResetForm) => {
        if (token) {
            dispatch(resetPassword({ token, ...data }));
        }
    };

    return (
        <>
            <Container size="sm">
                <Paper withBorder shadow="sm" radius="md" p="xl">
                    <Title order={3} mb="md" ta="center">
                        Reset Password
                    </Title>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <PasswordInput
                                {...register('password')}
                                label="Password"
                                placeholder="Your password"
                                leftSection={<Lock size={16} />}
                                required
                            />
                            <PasswordInput
                                {...register('confirmPassword')}
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                error={errors.confirmPassword?.message}
                                leftSection={<Lock size={16} />}
                                required
                            />

                            {error && <Text c="red">{error}</Text>}
                            {success && (
                                <Text c="green">
                                    Reset password successfully
                                </Text>
                            )}

                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? 'Reseting password...'
                                    : 'Reset password'}
                            </Button>

                            <Button
                                variant="subtle"
                                component={Link}
                                to="/login"
                            >
                                Back to login
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </>
    );
};

export default PasswordReset;
