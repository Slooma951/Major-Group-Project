'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import styles from './profile.module.css';

export default function Profile() {
    const router = useRouter();
    const [userData, setUserData] = useState({ username: 'User' });
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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

    const handleUpdate = async (action, payload) => {
        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...payload }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                if (action === 'updateUsername') {
                    setUserData({ ...userData, username: payload.newUsername });
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(`Error during ${action}:`, error);
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
            <Box className={styles.formContainer}>
                <TextField
                    label="New Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    className={styles.inputField}
                />
                <Button
                    variant="contained"
                    className={styles.updateButton}
                    onClick={() => handleUpdate('updateUsername', { newUsername })}
                >
                    Update Username
                </Button>

                <TextField
                    label="New Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    className={styles.inputField}
                />
                <Button
                    variant="contained"
                    className={styles.updateButton}
                    onClick={() => handleUpdate('updateEmail', { newEmail })}
                >
                    Update Email
                </Button>

                <TextField
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    className={styles.inputField}
                />
                <TextField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    className={styles.inputField}
                />
                <Button
                    variant="contained"
                    className={styles.updateButton}
                    onClick={() => handleUpdate('updatePassword', { currentPassword, newPassword })}
                >
                    Update Password
                </Button>
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
