import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailVerification, resetStatus } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../hooks/redux';
import { RootState } from '../../store';
import {
    Button,
    Container,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { Mail } from 'lucide-react';

export interface EmailVerificationForm {
    email: string;
}

const schema = z.object({
    email: z.string().email('Invalid email address'),
});

const EmailVerification = () => {
    const { success, isLoading, user, error } = useSelector(
        (state: RootState) => state.auth,
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EmailVerificationForm>({
        resolver: zodResolver(schema),
    });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [navigate, user]);

    useEffect(() => {
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch]);

    const onSubmit = (data: EmailVerificationForm) => {
        dispatch(emailVerification(data));
    };

    return (
        <>
            <Container size="sm">
                <Paper withBorder shadow="sm" radius="md" p="xl">
                    <Title order={3} mb="md" ta="center">
                        Email Verification
                    </Title>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <Text size="sm" c="dimmed">
                                Enter your email address and we'll send you
                                instructions to verify your email.
                            </Text>
                            <TextInput
                                {...register('email')}
                                label="Email"
                                placeholder="your@email.com"
                                error={errors.email?.message}
                                leftSection={<Mail size={16} />}
                                required
                            />

                            {error && <Text c="red">{error}</Text>}
                            {success && <Text c="green">Email Sent</Text>}

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Sending email...' : 'Send email'}
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

export default EmailVerification;
