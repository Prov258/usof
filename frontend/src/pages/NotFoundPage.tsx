import { Button, Container, Group, Text, Title } from '@mantine/core';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Container
            size="md"
            style={{ textAlign: 'center', paddingTop: '100px' }}
        >
            <Title order={1} size={120} c="blue">
                404
            </Title>
            <Title order={2} mb="xl">
                Page Not Found
            </Title>
            <Text c="dimmed" size="lg" mb="xl">
                The page you are looking for doesn't exist or has been moved.
            </Text>
            <Group justify="center">
                <Button
                    leftSection={<Home size={16} />}
                    component={Link}
                    to="/"
                >
                    Back to Home
                </Button>
            </Group>
        </Container>
    );
};

export default NotFoundPage;
