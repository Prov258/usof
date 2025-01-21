import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileTabs from '../../components/profile/ProfileTabs';
import { Container } from '@mantine/core';

const Profile = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [navigate, user]);

    return (
        <Container size="lg">
            <ProfileHeader user={user} />
            <ProfileTabs user={user} />
        </Container>
    );
};

export default Profile;
