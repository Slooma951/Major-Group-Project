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

    const cancelEdit = () => {
        setEditingField(null);
        setEditValue('');
        setErrorMessage('');
    };

    const saveEdit = async () => {
        setErrorMessage('');
        try {
            const action = editingField === 'email' ? 'updateEmail' : 'updatePassword';
            const payload =
                editingField === 'email' ? { newEmail: editValue } : { newPassword: editValue };
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...payload }),
            });
            const data = await response.json();
            if (response.ok) {
                if (action === 'updateEmail') {
                    setUserData({ ...userData, email: editValue });
                }
                setEditingField(null);
                setEditValue('');
            } else {
                setErrorMessage(data.message || 'An error occurred. Please try again.');
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
                    <span className={styles.infoValue}>{userData.username}</span>
                </div>

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
                            <button className={styles.cancelButton} onClick={cancelEdit}>Cancel</button>
                        </div>
                    ) : (
                        <>
                            <span className={styles.infoValue}>{userData.email}</span>
                            <EditIcon
                                className={styles.editIcon}
                                onClick={() => startEditing('email', userData.email)}
                            />
                        </>
                    )}
                </div>
                {editingField === 'email' && errorMessage && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}

                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Password</span>
                    {editingField === 'password' ? (
                        <div className={styles.inlineEditor}>
                            <input
                                className={styles.inputField}
                                type="password"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                            />
                            <button className={styles.saveButton} onClick={saveEdit}>Save</button>
                            <button className={styles.cancelButton} onClick={cancelEdit}>Cancel</button>
                        </div>
                    ) : (
                        <>
                            <span className={styles.infoValue}>********</span>
                            <EditIcon
                                className={styles.editIcon}
                                onClick={() => startEditing('password', '')}
                            />
                        </>
                    )}
                </div>
                {editingField === 'password' && errorMessage && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}
            </Box>

            <button className={`${styles.button} ${styles.logout}`} onClick={handleLogout}>
                Logout
            </button>

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
