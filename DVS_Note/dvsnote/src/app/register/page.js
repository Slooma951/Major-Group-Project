'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import Image from 'next/image';
import '../globals.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        <Box className="mainContainer">
            <Image
                src="/images/logo.png"
                alt="DVS Note logo"
                width={200}
                height={150}
                priority
                className="logo"
            />
            <Typography variant="h5" className="welcomeText">
                Create Your Account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} className="contentContainer">
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    InputProps={{ style: { color: 'white' } }}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    InputProps={{ style: { color: 'white' } }}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    InputProps={{ style: { color: 'white' } }}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    className="addButton"
                    style={{ marginTop: '16px' }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </Button>
                {message && (
                    <Typography
                        variant="body2"
                        style={{
                            color: message.includes('successful') ? '#4caf50' : '#f44336',
                            marginTop: '12px'
                        }}
                    >
                        {message}
                    </Typography>
                )}
                <Typography variant="body2" style={{ marginTop: '16px', color: '#ccc' }}>
                    Already have an account?{' '}
                    <Link href="/login" underline="hover" style={{ color: 'var(--primary-color)' }}>
                        Login here
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}
