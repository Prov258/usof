import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser } from '../../store/slices/authSlice';
import type { RootState } from '../../store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import {
    Anchor,
    Button,
    Container,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { Lock, Mail, User } from 'lucide-react';

export interface RegisterForm {
    login: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
}

const schema = z
    .object({
        email: z.string().email('Invalid email address'),
        fullName: z.string().min(1, 'Full Name is required'),
        login: z.string().min(1, 'Login is required'),
        password: z.string().min(1, 'Password is required'),
        confirmPassword: z.string().min(1, 'Password Confirm is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    });

const Register = () => {
    const { success, user, isLoading, error } = useSelector(
        (state: RootState) => state.auth,
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(schema),
    });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterForm) => {
        dispatch(registerUser(data));
    };

    useEffect(() => {
        if (success) navigate('/login');
        if (user) navigate('/');
    }, [navigate, user, success]);

    return (
        <Container size="sm">
            <Paper withBorder shadow="sm" radius="md" p="xl">
                <Title order={3} mb="md" ta="center">
                    Create Account
                </Title>

                <form onSubmit={handleSubmit(onSubmit)}>
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
                            error={errors.fullName?.message}
                            leftSection={<User size={16} />}
                            required
                        />
                        <TextInput
                            {...register('email')}
                            label="Email"
                            placeholder="your@email.com"
                            error={errors.email?.message}
                            leftSection={<Mail size={16} />}
                            required
                        />
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

                        <Button type="submit" disabled={isLoading} mt="sm">
                            {isLoading
                                ? 'Creating account...'
                                : 'Create Account'}
                        </Button>

                        <Text mt="sm">
                            Already have an account?{' '}
                            <Anchor component={Link} to="/login">
                                Sign in
                            </Anchor>
                        </Text>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default Register;
