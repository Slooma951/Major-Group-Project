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

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/checkSession');
        if (res.ok) router.push('/dashboard');
      } catch (err) {
        console.error('Session check error:', err);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage(data.message || 'Registration successful');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      setMessage('An error occurred. Please try again.');
      setLoading(false);
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

      <Typography variant="h4" className="welcomeText" gutterBottom>
        Create Your Account
      </Typography>

      <Box component="form" onSubmit={handleSubmit} className="contentContainer" sx={{ mt: 2 }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          InputProps={{ style: { color: '#111' } }}
          InputLabelProps={{ style: { color: '#666' } }}
        />

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          InputProps={{ style: { color: '#111' } }}
          InputLabelProps={{ style: { color: '#666' } }}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          InputProps={{ style: { color: '#111' } }}
          InputLabelProps={{ style: { color: '#666' } }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          className="addButton"
          sx={{ mt: 2 }}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>

        {message && (
          <Typography
            variant="body2"
            sx={{
              color: message.includes('successful') ? 'success.main' : 'error.main',
              mt: 2,
            }}
          >
            {message}
          </Typography>
        )}

        <Typography variant="body2" sx={{ mt: 3, color: '#555' }}>
          Already have an account?{' '}
          <Link href="/login" underline="hover" sx={{ color: 'var(--primary-color)' }}>
            Login here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
