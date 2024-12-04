'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Container } from '@mui/material';
import Image from 'next/image';
import styles from './Register.module.css';

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
        <Container className={styles.container}>
            <Image
                src="/images/logo.png"
                alt="DVS Note logo"
                width={200}
                height={150}
                priority
                className={styles.logo}
            />
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
        </Container>
    );
}
