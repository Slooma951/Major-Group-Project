'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import Image from 'next/image';
import styles from './register.module.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
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
        <Box className={styles.container}>
            <Image
                src="/images/logo.png"
                alt="DVS Note logo"
                width={260}
                height={200}
                priority
                className={styles.logo}
            />
            <Typography variant="h5" className={styles.title}>
                Create Your Account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} className={styles.form}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    className={styles.input}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    className={styles.input}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    className={styles.input}
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    className={styles.registerButton}
                >
                    {loading ? 'Registering...' : 'Register'}
                </Button>
                {message && (
                    <Typography
                        variant="body2"
                        className={
                            message.includes('successful')
                                ? styles.successMessage
                                : styles.errorMessage
                        }
                    >
                        {message}
                    </Typography>
                )}
                <Typography variant="body2" className={styles.loginText}>
                    Already have an account?{' '}
                    <Link href="/login" underline="hover" className={styles.loginLink}>
                        Login here
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}