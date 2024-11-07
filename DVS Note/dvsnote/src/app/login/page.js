'use client'

import * as React from 'react';
import { Box, Button, TextField, Typography, Link, Container } from '@mui/material';
import Image from "next/image";

export default function AuthPage() {
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
            <Box component="form" sx={{
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
                    sx={{
                        bgcolor: 'white',
                    }}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    type="password"
                    margin="normal"
                    sx={{
                        bgcolor: 'white',
                    }}
                />
                <Button
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
                <Typography variant="body2" sx={{ marginTop: 2, color: '#6b6b6b' }}>
                    Don't have an account? <Link href="/signup" underline="hover" color="#6272e3">Sign up</Link>
                </Typography>
            </Box>
        </Container>
    );
}
