import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutArgs {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutArgs> = ({ children }) => {
    return (
        <div>
            <Header />
            <Sidebar />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
