'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';

export default function Profile() {
    const router = useRouter();
    const [userData, setUserData] = useState({ username: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/checkSession');
                if (response.ok) {
                    const data = await response.json();
                    setUserData({ username: data.user.username });
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            }
        };

        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
            });
            if (response.ok) {
                router.push('/login');
            } else {
                alert('Logout failed!');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <Box className={styles.container}>
            <Typography variant="h5" className={styles.title}>
                Profile
            </Typography>
            <Box className={styles.infoContainer}>
                <Typography variant="body1" className={styles.info}>
                    <strong>Username:</strong> {userData.username}
                </Typography>
            
            </Box>
            <Button
                variant="contained"
                className={styles.logoutButton}
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Box>
    );
}