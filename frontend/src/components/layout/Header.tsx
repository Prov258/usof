import {
    AppShell,
    Avatar,
    Burger,
    Button,
    Container,
    Group,
    Text,
    Title,
} from '@mantine/core';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { LogIn, LogOut, PlusSquare, User, UserPlus } from 'lucide-react';
import { url } from '../../utils/funcs';
import { RootState } from '../../store';

interface HeaderProps {
    opened: boolean;
    toggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ opened, toggle }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        dispatch(logout());
    };

    return (
        <AppShell.Header>
            <Container size="xl" h="100%">
                <Group h="100%" px="md">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Group justify="space-between" style={{ flex: 1 }}>
                        <Title order={3} component={Link} to="/">
                            TellMe
                        </Title>
                        <Group ml="xl" gap={25} visibleFrom="sm">
                            {user ? (
                                <>
                                    <Button
                                        variant="light"
                                        leftSection={<PlusSquare size={20} />}
                                        component={Link}
                                        to="/create-post"
                                    >
                                        Ask Question
                                    </Button>
                                    <Link to="/profile">
                                        <Group>
                                            <Text>{user.login}</Text>
                                            {user.avatar ? (
                                                <Avatar
                                                    radius="xl"
                                                    src={url(user.avatar)}
                                                    alt={user.login}
                                                />
                                            ) : (
                                                <User size={20} />
                                            )}
                                        </Group>
                                    </Link>
                                    <Button
                                        variant="transparent"
                                        onClick={handleLogout}
                                        leftSection={<LogOut size={20} />}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="subtle"
                                        leftSection={<LogIn size={20} />}
                                        component={Link}
                                        to="/login"
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        leftSection={<UserPlus size={20} />}
                                        component={Link}
                                        to="/register"
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </Group>
                    </Group>
                </Group>
            </Container>
        </AppShell.Header>
    );
};

export default Header;
