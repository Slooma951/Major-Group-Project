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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/navigation';

export default function Journal() {
    const router = useRouter();
    const [userName, setUserName] = useState('User');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [journalEntry, setJournalEntry] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/user?userId=${localStorage.getItem('userId')}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.username);
                } else {
                    router.push('/login');
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
                body: JSON.stringify({
                    userId: localStorage.getItem('userId'),
                    journalEntry,
                    date: selectedDate,
                }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Entry saved successfully!');
                setJournalEntry('');
            } else {
                alert(data.message || 'Failed to save entry!');
            }
        } catch (error) {
            console.error('Error saving journal entry:', error);
            alert('Error saving entry!');
        }
    };

    const adjustDate = (days) => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + days);
        setSelectedDate(currentDate.toISOString().split('T')[0]);
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
                color: 'black',
                padding: 2,
            }}
        >
            <AppBar
                position="static"
                sx={{
                    bgcolor: '#505c75',
                    width: '100%',
                    borderRadius: '20px',
                    boxShadow: 5,
                    marginBottom: '20px',
                }}
            >
                <Toolbar
                    sx={{
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
                        sx={{
                            flexGrow: 1,
                            textAlign: 'center',
                            fontSize: '1.25rem',
                            color: 'white',
                        }}
                    >
                        Journal
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '80%',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                }}
            >
                <Image src="/images/logo.png" alt="Logo" width={70} height={55} priority />
                <List>
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
                                }}
                            />
                        </ListItem>
                    ))}
                    <Divider />
                </List>
            </Drawer>

            <Container
                sx={{
                    width: '90%',
                    bgcolor: 'white',
                    boxShadow: 5,
                    borderRadius: '20px',
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#505c75',
                    }}
                >
                    How was your day, {userName}?
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <IconButton onClick={() => adjustDate(-1)}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography>{selectedDate}</Typography>
                    <IconButton onClick={() => adjustDate(1)}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>

                <TextareaAutosize
                    minRows={8}
                    style={{
                        width: '100%',
                        fontSize: '16px',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #505c75',
                        resize: 'none',
                        backgroundColor: '#f9f9f9',
                        color:'black',
                    }}
                    placeholder="Write about your day..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                />

                <Button
                    onClick={saveJournalEntry}
                    variant="contained"
                    sx={{
                        bgcolor: '#505c75',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '10px',
                    }}
                >
                    Save Entry
                </Button>
            </Container>
        </Box>
    );
}
