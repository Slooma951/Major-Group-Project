'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    AppBar,
    Box,
    Button,
    Container,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextareaAutosize,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';

export default function Journal() {
    const router = useRouter();
    const [userName, setUserName] = useState('User'); 
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [journalEntry, setJournalEntry] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/user?userId=${localStorage.getItem('userId')}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.username);
                } else {
                    router.push('/login'); // Redirect to login if user is not logged in
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            }
        };

        fetchUserData();
    }, [router]);

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const saveJournalEntry = async () => {
        try {
            const response = await fetch('/api/saveJournalEntry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ journalEntry, userName }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Entry saved successfully!');
                setJournalEntry('');
            } else {
                alert('Failed to save entry!');
            }
        } catch (error) {
            console.error('Failed to save journal entry:', error);
            alert('Error saving entry!');
        }
    };

    const navItems = [
        { text: 'Dashboard', link: '/dashboard' },
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
                    marginBottom: '100px',
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
                        Journal
                    </Typography>
                </Toolbar>
            </AppBar>
    
            {/* Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '70%',
                        maxWidth: '250px',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
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
            <Container
                sx={{
                    width: '95%',
                    maxWidth: '500px',
                    bgcolor: 'background.paper',
                    boxShadow: 5,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 3,
                    gap: 3,
                }}
            >
                {/* Greeting */}
                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: 'Nunito, sans-serif',
                        fontWeight: 'bold',
                        color: '#505c75',
                        textAlign: 'center',
                    }}
                >
                    How was your day, {userName}?
                </Typography>
    
                {/* Textarea */}
                <TextareaAutosize
                    minRows={8}
                    style={{
                        width: '100%',
                        fontSize: '16px',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1.5px solid #505c75',
                        outline: 'none',
                        resize: 'none',
                        boxShadow: 'inset 0px 4px 12px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f9f9f9',
                    }}
                    placeholder="Write about your day..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                />
    
                {/* Save Button */}
                <Button
                    onClick={saveJournalEntry}
                    variant="contained"
                    sx={{
                        bgcolor: '#505c75',
                        color: 'common.white',
                        ':hover': { bgcolor: '#404f65' },
                        borderRadius: '12px',
                        padding: '14px',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                        fontSize: '1rem',
                    }}
                >
                    Save Entry
                </Button>
            </Container>
        </Box>
    );
}    