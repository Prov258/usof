import React, { ReactNode } from 'react';
import { AppShell, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Header from './Header';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { desktop: true, mobile: !opened },
            }}
            padding="md"
        >
            <Header opened={opened} toggle={toggle} />

            <AppShell.Navbar py="md" px={4}>
                <UnstyledButton>Home</UnstyledButton>
                <UnstyledButton>Blog</UnstyledButton>
                <UnstyledButton>Contacts</UnstyledButton>
                <UnstyledButton>Support</UnstyledButton>
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
};

export default Layout;
