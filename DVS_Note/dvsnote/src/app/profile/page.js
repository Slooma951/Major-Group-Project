'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import styles from './profile.module.css';

export default function Profile() {
    const router = useRouter();
    const [userData, setUserData] = useState({ username: 'User' });

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

    const navItems = [
        { text: 'Home', icon: <HomeIcon className={styles.navIcon} />, link: '/dashboard' },
        { text: 'Journal', icon: <BookIcon className={styles.navIcon} />, link: '/journal' },
        { text: 'To-Do List', icon: <ChecklistIcon className={styles.navIcon} />, link: '/todo' },
        { text: 'Profile', icon: <PersonIcon className={styles.navIcon} />, link: '/profile' },
    ];

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
            {/* Bottom Navigation */}
            <Box className={styles.bottomNav}>
                {navItems.map((item, index) => (
                    <Box
                        key={index}
                        className={styles.navItem}
                        onClick={() => router.push(item.link)}
                    >
                        {item.icon}
                        <Typography className={styles.navText}>{item.text}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
