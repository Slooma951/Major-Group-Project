'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import {
  Home as HomeIcon,
  Book as BookIcon,
  Checklist as ChecklistIcon,
  Person as PersonIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
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
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/checkSession');
        if (!res.ok) return router.push('/login');
        const data = await res.json();
        setUserData({ username: data.user.username, email: data.user.email });
      } catch (err) {
        console.error('Failed to fetch session:', err);
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (res.ok) router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const startEditing = (field, value = '') => {
    setEditingField(field);
    setEditValue(value);
    setCurrentPassword('');
    setNewPassword('');
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
    let action = '', payload = {};
    if (editingField === 'email') {
      action = 'updateEmail';
      payload = { newEmail: editValue };
    } else if (editingField === 'password') {
      action = 'updatePassword';
      payload = { currentPassword, newPassword };
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();

      if (res.ok) {
        if (editingField === 'email') {
          setUserData({ ...userData, email: editValue });
        }
        cancelEdit();
      } else {
        setErrorMessage(data.message || 'Update failed.');
      }
    } catch (err) {
      setErrorMessage('Something went wrong.');
    }
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Journal', icon: <BookIcon />, link: '/journal' },
    { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  ];

  return (
    <Box className="mainContainer" sx={{ pt: 5, px: 2, textAlign: 'center' }}>
      <Typography variant="h4" className="welcomeText" gutterBottom>
        Profile
      </Typography>

      <Box
        className="boxContainer"
        sx={{
          maxWidth: '600px',
          mx: 'auto',
          backgroundColor: '#f3ecff',
          borderRadius: 3,
          p: 4,
          boxShadow: 3,
        }}
      >
        {/* Username */}
        <Typography variant="h6" gutterBottom>
          Username
        </Typography>
        <Typography sx={{ color: '#444', mb: 3 }}>{userData.username}</Typography>

        {/* Email */}
        <Typography variant="h6" gutterBottom>
          Email
        </Typography>
        {editingField === 'email' ? (
          <>
            <input
              type="email"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={inputStyle}
            />
            <Box mt={1}>
              <Button className="addButton" onClick={saveEdit}>Save</Button>
              <Button onClick={cancelEdit} sx={{ ml: 2, color: '#888' }}>Cancel</Button>
            </Box>
          </>
        ) : (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography sx={{ color: '#666' }}>{userData.email}</Typography>
            <IconButton onClick={() => startEditing('email', userData.email)} color="primary">
              <EditIcon />
            </IconButton>
          </Box>
        )}

        {/* Password */}
        <Typography variant="h6" gutterBottom>
          Password
        </Typography>
        {editingField === 'password' ? (
          <>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ ...inputStyle, marginTop: '8px' }}
            />
            <Box mt={1}>
              <Button className="addButton" onClick={saveEdit}>Save</Button>
              <Button onClick={cancelEdit} sx={{ ml: 2, color: '#888' }}>Cancel</Button>
            </Box>
          </>
        ) : (
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography sx={{ color: '#666' }}>********</Typography>
            <IconButton onClick={() => startEditing('password')} color="primary">
              <EditIcon />
            </IconButton>
          </Box>
        )}

        {errorMessage && (
          <Typography sx={{ color: 'error.main', mt: 2 }}>{errorMessage}</Typography>
        )}
      </Box>

      <Button className="addButton" onClick={handleLogout} sx={{ mt: 4 }}>
        Logout
      </Button>

      {/* Bottom Nav */}
      <Box className="bottomNav" sx={{ mt: 5 }}>
        {navItems.map((item) => (
          <Button
            key={item.text}
            className="navItem"
            onClick={() => router.push(item.link)}
          >
            {item.icon}
            <Typography variant="caption">{item.text}</Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  marginTop: '4px',
  color: '#111'
};