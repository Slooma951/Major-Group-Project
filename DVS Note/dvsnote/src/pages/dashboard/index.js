'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Paper, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';

export default function Dashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState('User');
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const isLoggedIn = true;
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [router]);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const navItems = [
        { text: 'Journal', link: '/journal' },
        { text: 'Notes', link: '/notes' },
        { text: 'To-Do List', link: '/todo' },
        { text: 'Account Details', link: '/account' },
        { text: 'Logout', link: '/logout' }
    ];

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
            <AppBar position="fixed" sx={{ bgcolor: '#6272e3', width: '23vw', left: '39%', boxShadow: 'none' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Toolbar /> {/* Spacer for AppBar */}

            {/* Drawer for Sidebar Navigation */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '40vw',
                        bgcolor: '#e6eaf8',
                        borderRadius: '12px',
                    },
                }}
            >
                <Box
                    sx={{ width: '35vw', fontFamily: 'YourFontFamily' }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                        <Image src="/images/logo.png" alt="DVS Note Logo" width={55} height={60} />
                    </Box>
                    <Divider sx={{ borderColor: '#6272e3' }} />
                    <List>
                        {navItems.map((item) => (
                            <ListItem button key={item.text} component="a" href={item.link}>
                                <ListItemText primary={item.text} sx={{ textAlign: 'center', color: '#6272e3', fontWeight: 'bold' }} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Typography variant="h5" gutterBottom sx={{ fontFamily: 'YourFontFamily', color: '#6272e3', fontWeight: 'bold' }}>
                Welcome, {userName}!
            </Typography>

            <Box sx={{ mt: 3 }}>
                <Button
                    variant="contained"
                    sx={{
                        bgcolor: '#6272e3',
                        color: 'white',
                        ':hover': { bgcolor: '#556bd8' },
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                    }}
                >
                    Add New Task
                </Button>
            </Box>
        </Container>
    );
}