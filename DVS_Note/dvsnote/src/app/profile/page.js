'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import styles from './profile.module.css';

export default function Profile() {
    const router = useRouter();
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/checkSession');
                if (response.ok) {
                    const data = await response.json();
                    setUserData({ username: data.user.username, email: data.user.email });
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
            const response = await fetch('/api/logout', { method: 'POST' });
            if (response.ok) {
                router.push('/login');
            } else {
                console.log('Logout failed!');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const startEditing = (field, currentValue) => {
        setEditingField(field);
        setEditValue(currentValue);
        setErrorMessage('');
    };

    const saveEdit = async () => {
        setErrorMessage('');
        try {
            const action = editingField === 'username' ? 'updateUsername' : 'updateEmail';
            const payload = editingField === 'username' ? { newUsername: editValue } : { newEmail: editValue };
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...payload }),
            });
            const data = await response.json();
            if (response.ok) {
                if (action === 'updateUsername') {
                    setUserData({ ...userData, username: editValue });
                } else {
                    setUserData({ ...userData, email: editValue });
                }
                setEditingField(null);
                setEditValue('');
            } else {
                // If the server says username or email is taken, display a specific error message
                if (data.message && (data.message.includes("taken") || data.message.includes("exists"))) {
                    setErrorMessage(data.message); // e.g. "This username is already taken" or "This email is already taken"
                } else {
                    setErrorMessage('An error occurred. Please try again.');
                }
            }
        } catch (error) {
            console.error(`Error saving ${editingField}:`, error);
            setErrorMessage('An error occurred. Please try again.');
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
            <Typography className={styles.title}>Profile</Typography>
            <Box className={styles.infoCard}>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Username</span>
                    {editingField === 'username' ? (
                        <div className={styles.inlineEditor}>
                            <input
                                className={styles.inputField}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                            />
                            <button className={styles.saveButton} onClick={saveEdit}>Save</button>
                        </div>
                    ) : (
                        <>
                            <span className={styles.infoValue}>{userData.username}</span>
                            <EditIcon className={styles.editIcon} onClick={() => startEditing('username', userData.username)} />
                        </>
                    )}
                </div>
                {editingField === 'username' && errorMessage && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}

                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email</span>
                    {editingField === 'email' ? (
                        <div className={styles.inlineEditor}>
                            <input
                                className={styles.inputField}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                            />
                            <button className={styles.saveButton} onClick={saveEdit}>Save</button>
                        </div>
                    ) : (
                        <>
                            <span className={styles.infoValue}>{userData.email}</span>
                            <EditIcon className={styles.editIcon} onClick={() => startEditing('email', userData.email)} />
                        </>
                    )}
                </div>
                {editingField === 'email' && errorMessage && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}
            </Box>

            <button className={`${styles.button} ${styles.logout}`} onClick={handleLogout}>Logout</button>

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
