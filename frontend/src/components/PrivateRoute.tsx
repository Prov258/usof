import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
