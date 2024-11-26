'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {AppBar, Box, Button,Container,Divider,Drawer,IconButton,List, ListItem, ListItemText,  Toolbar,Typography,} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState('User');
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/user?userId=${localStorage.getItem('userId')}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.username);
                } else {
                    router.push('/login'); // Redirect to login if user data is not available
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login'); // Redirect to login on error
            }
        };

        fetchUserData();
    }, [router]);

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const navItems = [
        { text: 'Journal', link: '/journal' },
        { text: 'Notes', link: '/notes' },
        { text: 'To-Do List', link: '/todo' },
        { text: 'Account Details', link: '/account' },
        { text: 'Logout', link: '/logout' },
    ];
    

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
                padding: 2,
            }}
        >
            {/* AppBar */}
            <AppBar
                position="static"
                sx={{
                    bgcolor: '#505c75',
                    width: '110%',
                    maxWidth: '600px',
                    borderRadius: '20px',
                    boxShadow: 5,
                    marginBottom: '10px',
                }}
            >
                <Toolbar
                    sx={{
                        minHeight: '50px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingX: '20px',
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            textAlign: 'center',
                            fontSize: '1.25rem',
                            color: 'common.white',
                        }}
                    >
                        Dashboard	
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Main Container */}
            <Container
                sx={{
                    width: '100%',
                    maxWidth: '500px',
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '80vh',
                    justifyContent: 'space-between',
                    padding: 2,
                }}
            >
                {/* Drawer */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: '70%', // Reduced drawer width
                            maxWidth: '250px',
                            bgcolor: 'background.paper',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                            borderRadius: '0 20px 20px 0', // Optional rounded corners
                        },
                    }}
                >
                    <Image src="/images/logo.png" alt="Logo" width={70} height={55} priority />
                    <List sx={{ width: '50%' }}>
                        {navItems.map((item) => (
                            <ListItem
                                key={item.text}
                                button 
                                component="a"
                                href={item.link}
                                sx={{
                                    textAlign: 'left',
                                    justifyContent: 'left',
                                    paddingY: '10px',
                                }}
                            >
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#505c75',
                                        fontSize: '1rem',
                                    }}
                                />
                            </ListItem>
                        ))}
                        <Divider />
                    </List>
                </Drawer>

                {/* Main Content */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px 24px',
                        rowGap: '16px',
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: 'Nunito, sans-serif',
                            fontWeight: 'bold',
                            color: '#505c75',
                            fontSize: '1.5rem',
                            marginBottom: '8px',
                        }}
                    >
                        Welcome, {userName}
                    </Typography>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            bgcolor: '#505c75',
                            color: 'common.white',
                            ':hover': { bgcolor: '#404f65' },
                            borderRadius: '12px',
                            padding: '12px 16px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            fontSize: '1rem',
                        }}
                    >
                        Add New Task
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
