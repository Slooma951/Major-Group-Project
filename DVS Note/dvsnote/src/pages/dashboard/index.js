// src/pages/dashboard/index.js
'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        // Check if the user is logged in, otherwise redirect to login
        const isLoggedIn = true;
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [router]);

    return (
        <Container maxWidth="lg" sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Welcome, {userName}!
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Here is your dashboard where you can manage your tasks, goals, and view recent activities.
            </Typography>

            <Grid container spacing={4}>
                {/* Task Summary Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 3, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Task Summary
                        </Typography>
                        <Typography variant="body1">
                            You have 5 tasks due soon.
                        </Typography>
                    </Paper>
                </Grid>

                {/* Recent Activities Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 3, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activities
                        </Typography>
                        <Typography variant="body1">
                            Last journal entry was created 2 days ago.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Add more sections as needed */}
            <Box mt={4}>
                <Typography variant="body2" color="textSecondary">
                    More dashboard features will be added here.
                </Typography>
            </Box>
        </Container>
    );
}
