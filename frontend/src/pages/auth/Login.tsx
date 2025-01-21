import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
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
import { Lock, Mail } from 'lucide-react';

export interface LoginForm {
    email: string;
    password: string;
}

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const Login = () => {
    const { user, isLoading, error } = useSelector(
        (state: RootState) => state.auth,
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(schema),
    });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginForm) => {
        dispatch(login(data));
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [navigate, user]);

    return (
        <Container size="sm">
            <Paper withBorder shadow="sm" radius="md" p="xl">
                <Title order={3} mb="md" ta="center">
                    Sign In
                </Title>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack>
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

                        {error && <Text c="red">{error}</Text>}

                        <Button
                            variant="subtle"
                            component={Link}
                            to="/forgot-password"
                        >
                            Forgot password?
                        </Button>

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>

                        <Text mt="sm">
                            Didn't receive verification email?{' '}
                            <Anchor component={Link} to="/email-verification">
                                Send again
                            </Anchor>
                        </Text>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
