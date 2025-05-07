'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Container
} from '@mui/material';
import Image from 'next/image';
import '../globals.css';

export default function AuthPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/checkSession');
        if (res.ok) router.push('/dashboard');
      } catch (err) {
        console.error('Session check failed:', err);
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage('Login successful');
        router.push('/dashboard');
      } else {
        setMessage(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <Container className="mainContainer" maxWidth="xs">
      <Image src="/images/logo.png" alt="DVS Note Logo" width={200} height={150} priority className="logo" />

      <Typography variant="h4" className="welcomeText" gutterBottom>
        Login
      </Typography>

      <Box component="form" onSubmit={handleLogin} className="contentContainer" noValidate>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{ style: { color: 'black' } }}
          InputLabelProps={{ style: { color: '#444' } }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{ style: { color: 'black' } }}
          InputLabelProps={{ style: { color: '#444' } }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          className="addButton"
          sx={{ mt: 2 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        {message && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: message === 'Login successful' ? 'green' : 'error.main'
            }}
          >
            {message}
          </Typography>
        )}

        <Typography variant="body2" sx={{ mt: 3, color: '#555' }}>
          Don't have an account?{' '}
          <Link href="/register" underline="hover" sx={{ color: 'primary.main' }}>
            Sign up here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
