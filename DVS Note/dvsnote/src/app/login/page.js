'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Container } from '@mui/material';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { DiscFullSharp } from '@mui/icons-material';

export default function AuthPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Login successful');
                router.push('/dashboard/');
            } else {
                setMessage(data.message || 'Invalid username or password');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: '#e6eaf8',
            padding: 3,
        }}>
            <Image
                src="/images/logo.png"
                alt="DVS Note logo"
                width={260}
                height={200}
                priority
                style={{ marginBottom: '2rem' }}
            />
            <Box component="form" onSubmit={handleLogin} sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: 'none',
            }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Username"
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ bgcolor: 'white' }}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ bgcolor: 'white' }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        marginTop: 2,
                        bgcolor: '#6272e3',
                        color: 'white',
                        ':hover': { bgcolor: '#556bd8' },
                    }}
                >
                    Login
                </Button>
                {message && (
                    <Typography variant="body2" sx={{ marginTop: 2, color: '#6b6b6b' }}>
                        {message}
                    </Typography>
                )}
                <Typography variant="body2" sx={{ marginTop: 2, color: '#6b6b6b' }}>
                    Don't have an account? <Link href="/register" underline="hover" color="#6272e3">Sign Up here</Link>
                </Typography>
            </Box>
        </Container>
    );
}
