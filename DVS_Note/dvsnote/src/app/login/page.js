'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Link, Container } from '@mui/material';
import Image from 'next/image';
import '../globals.css';

export default function AuthPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/checkSession', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Error checking session:', error);
            }
        };

        checkSession();
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                setMessage('Login successful');
                router.push('/dashboard');
            } else {
                setMessage(data.message || 'Invalid username or password');
            }
        } catch (error) {
            setLoading(false);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <Container className="mainContainer">
            <Image
                src="/images/logo.png"
                alt="DVS Note logo"
                width={200}
                height={150}
                priority
                className="logo"
            />
            <Typography variant="h4" component="h1" className="welcomeText">
                Login
            </Typography>
            <Box component="form" onSubmit={handleLogin} className="contentContainer">
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Username"
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    InputProps={{ style: { color: 'white' } }}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{ style: { color: 'white' } }}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    className="addButton"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
                {message && (
                    <Typography
                        variant="body2"
                        style={{
                            color: message === 'Login successful' ? '#4caf50' : '#f44336',
                            marginTop: '10px'
                        }}
                    >
                        {message}
                    </Typography>
                )}
                <Typography variant="body2" style={{ marginTop: '16px', color: '#ccc' }}>
                    Don't have an account?{' '}
                    <Link href="/register" underline="hover" style={{ color: '#8D5EF2' }}>
                        Sign Up here
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}
