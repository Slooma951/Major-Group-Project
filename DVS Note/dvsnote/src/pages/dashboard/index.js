'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
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
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: 'linear-gradient(180deg, #e6f1ff, #a1c4fd)',
        }}>
            <Container maxWidth="xs" sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: '#f8f9fa',
                height: '700px', // Fixed height to resemble a phone screen
                width: '380px', // Fixed width for mobile size
                borderRadius: '20px',
                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                position: 'relative',
            }}>
                <AppBar position="static" sx={{
                    bgcolor: '#6272e3',
                    width: '100%',
                    borderTopLeftRadius: '20px',
                    borderTopRightRadius: '20px',
                    boxShadow: 'none',
                }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ color: 'white' }}>
                            Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Centered Drawer as a Modal within the Container */}
                <Drawer
                    anchor="top"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: '380px', // Same as container width
                            height: '700px', // Same as container height
                            margin: 'auto', // Centered within the viewport
                            borderRadius: '20px', // Match container border radius
                            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)', // Same shadow as container
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            overflow: 'hidden', // Remove scroll bar
                        },
                    }}
                    variant="temporary" // Overlay the content
                >
                    <Box
                        sx={{ width: '100%', fontFamily: 'YourFontFamily', p: 2 }}
                        role="presentation"
                        onClick={toggleDrawer(false)}
                        onKeyDown={toggleDrawer(false)}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Image src="/images/logo.png" alt="DVS Note Logo" width={55} height={60} />
                        </Box>
                        <Divider sx={{ borderColor: '#6272e3' }} />
                        <List>
                            {navItems.map((item) => (
                                <ListItem button key={item.text} component="a" href={item.link}>
                                    <ListItemText primary={item.text} sx={{
                                        textAlign: 'center',
                                        color: '#6272e3',
                                        fontWeight: 'bold',
                                    }} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>

                {/* Main Content */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: 3,
                    mt: 2,
                }}>
                    <Typography variant="h5" gutterBottom sx={{
                        fontFamily: 'YourFontFamily',
                        color: '#6272e3',
                        fontWeight: 'bold',
                        mt: 5, // Space below the AppBar
                    }}>
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
                                padding: '10px 20px',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            Add New Task
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
