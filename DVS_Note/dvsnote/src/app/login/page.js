'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Link, Container } from '@mui/material';
import Image from 'next/image';
import styles from './login.module.css';

export default function AuthPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Check session on component mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/checkSession', {
                    method: 'GET',
                    credentials: 'include', // Include cookies for session validation
                });

                if (response.ok) {
                    // If session is valid, redirect to dashboard
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
                headers: {
                    'Content-Type': 'application/json',
                },
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
        <Container className={styles.container}>
            <Image
                src="/images/logo.png"
                alt="DVS Note logo"
                width={260}
                height={200}
                priority
                className={styles.logo}
            />
            <Typography variant="h4" component="h1" className={styles.title}>
                Login
            </Typography>
            <Box component="form" onSubmit={handleLogin} className={styles.form}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Username"
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    type="password"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    className={styles.loginButton}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
                {message && (
                    <Typography
                        variant="body2"
                        className={
                            message === 'Login successful'
                                ? styles.successMessage
                                : styles.errorMessage
                        }
                    >
                        {message}
                    </Typography>
                )}
                <Typography variant="body2" className={styles.signUpText}>
                    Don't have an account?{' '}
                    <Link href="/register" underline="hover" className={styles.signUpLink}>
                        Sign Up here
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}
