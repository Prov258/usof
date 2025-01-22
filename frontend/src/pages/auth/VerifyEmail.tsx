import {
    Button,
    Center,
    Container,
    Group,
    Loader,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { Check, LogIn } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/redux';
import { resetStatus, verifyEmail } from '../../store/slices/authSlice';

const VerifyEmail = () => {
    const { token } = useParams<{ token: string }>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);
    const hasRun = useRef(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const verifyEmailHandler = async () => {
            if (token && !hasRun.current) {
                hasRun.current = true;
                await dispatch(verifyEmail({ token }));
            }
        };

        verifyEmailHandler();
    }, [token, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(resetStatus());
        };
    }, [dispatch]);

    if (isLoading) {
        return (
            <Center h="200">
                <Loader color="blue" size="lg" />
            </Center>
        );
    }

    if (error) {
        return (
            <Center h="200">
                <Text c="red" size="xl" fw={700}>
                    {error}
                </Text>
            </Center>
        );
    }

    return (
        <Container size="md" pt={100}>
            <Stack align="center">
                <Check
                    size={80}
                    strokeWidth={1}
                    color="var(--mantine-color-green-6)"
                />
                <Title order={2} mb="md">
                    Email Verified Successfully!
                </Title>
                <Text c="dimmed" size="lg" mb="md">
                    Your email has been verified. You can now sign in to your
                    account.
                </Text>
                <Group justify="center">
                    <Button
                        leftSection={<LogIn size={16} />}
                        component={Link}
                        to="/login"
                    >
                        Sign In
                    </Button>
                </Group>
            </Stack>
        </Container>
    );
};

export default VerifyEmail;
