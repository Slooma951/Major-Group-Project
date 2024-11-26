'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Container } from '@mui/material';
import Image from 'next/image';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                setMessage(data.message || 'Registration successful');
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                setMessage(data.message || 'Registration failed');
            }
        } catch (error) {
            setLoading(false);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#e6eaf8',
                padding: 3,
            }}
        >
            <Image
                src="/images/logo.png"
                alt="DVS Note logo"
                width={200}
                height={150}
                priority
                style={{ marginBottom: '2rem' }}
            />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    sx={{ bgcolor: 'white' }}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    sx={{ bgcolor: 'white' }}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    sx={{ bgcolor: 'white' }}
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                        marginTop: 2,
                        bgcolor: '#6272e3',
                        color: 'white',
                        ':hover': { bgcolor: '#556bd8' },
                    }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </Button>
                {message && (
                    <Typography
                        variant="body2"
                        sx={{
                            marginTop: 2,
                            color: message.includes('successful') ? 'red' : 'green',
                        }}
                    >
                        {message}
                    </Typography>
                )}
                <Typography
                    variant="body2"
                    sx={{
                        marginTop: 2,
                        color: '#6b6b6b',
                    }}
                >
                    Already have an account?{' '}
                    <Link href="/login" underline="hover" color="#6272e3">
                        Login here
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}
