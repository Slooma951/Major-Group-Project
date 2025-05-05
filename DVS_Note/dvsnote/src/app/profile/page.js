'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import '../globals.css';

export default function Profile() {
    const router = useRouter();
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
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
        setCurrentPassword('');
        setNewPassword('');
        setErrorMessage('');
    };

    const saveEdit = async () => {
        setErrorMessage('');
        try {
            let action, payload;
            if (editingField === 'email') {
                action = 'updateEmail';
                payload = { newEmail: editValue };
            } else if (editingField === 'password') {
                action = 'updatePassword';
                payload = { currentPassword, newPassword };
            }

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
                cancelEdit();
            } else {
                setErrorMessage(data.message || 'An error occurred.');
            }
        } catch (error) {
            setErrorMessage('An error occurred.');
        }
    };

    const navItems = [
        { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
        { text: 'Journal', icon: <BookIcon />, link: '/journal' },
        { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
        { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
    ];

    return (
        <Box className="mainContainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
            <Typography variant="h5" className="welcomeText">Profile</Typography>

            <Box
                className="boxContainer"
                style={{
                    marginTop: '32px',
                    maxWidth: '700px',
                    padding: '24px 48px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#f1e6ff',
                }}
            >
                <Typography className="quotesHeader" style={{ marginBottom: '4px' }}>Username</Typography>
                <Typography style={{ color: '#555', fontSize: '1rem', marginBottom: '16px' }}>{userData.username}</Typography>

                <Typography className="quotesHeader" style={{ marginBottom: '4px' }}>Email</Typography>
                {editingField === 'email' ? (
                    <Box>
                        <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '8px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                fontSize: '1rem'
                            }}
                        />
                        <Button className="addButton" onClick={saveEdit}>Save</Button>
                        <Button onClick={cancelEdit} style={{ color: '#aaa', marginLeft: '10px' }}>Cancel</Button>
                    </Box>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography style={{ color: '#888' }}>{userData.email}</Typography>
                        <EditIcon onClick={() => startEditing('email', userData.email)} style={{ cursor: 'pointer', color: '#7d5ba6' }} />
                    </Box>
                )}

                {editingField === 'email' && errorMessage && (
                    <Typography style={{ color: '#f44336', marginTop: '8px' }}>{errorMessage}</Typography>
                )}

                <Typography className="quotesHeader" style={{ marginTop: '24px', marginBottom: '4px' }}>Password</Typography>
                {editingField === 'password' ? (
                    <Box>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '8px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                fontSize: '1rem'
                            }}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '8px',
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                fontSize: '1rem'
                            }}
                        />
                        <Button className="addButton" onClick={saveEdit}>Save</Button>
                        <Button onClick={cancelEdit} style={{ color: '#aaa', marginLeft: '10px' }}>Cancel</Button>
                    </Box>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography style={{ color: '#888' }}>********</Typography>
                        <EditIcon onClick={() => startEditing('password', '')} style={{ cursor: 'pointer', color: '#7d5ba6' }} />
                    </Box>
                )}

                {editingField === 'password' && errorMessage && (
                    <Typography style={{ color: '#f44336', marginTop: '8px' }}>{errorMessage}</Typography>
                )}
            </Box>

            <Button className="addButton" onClick={handleLogout} style={{ marginTop: '24px' }}>
                Logout
            </Button>

            <Box className="bottomNav" style={{ marginTop: '40px' }}>
                {navItems.map((item) => (
                    <Button key={item.text} className="navItem" onClick={() => router.push(item.link)}>
                        {item.icon}
                        <Typography variant="caption">{item.text}</Typography>
                    </Button>
                ))}
            </Box>
        </Box>
    );
}