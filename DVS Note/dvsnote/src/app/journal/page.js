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
import styles from './journal.module.css';

export default function Journal() {
    const router = useRouter();
    const [userName, setUserName] = useState('User');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [journalEntry, setJournalEntry] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Fetch user data and session
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch session information from the server
                const response = await fetch('/api/checkSession');
                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.user.username);
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
        <Box className={styles.mainContainer}>
            <AppBar position="static" className={styles.appBar}>
                <Toolbar className={styles.toolbar}>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={styles.title}>
                        Journal
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                classes={{ paper: styles.drawerPaper }}
            >
                <Image src="/images/logo.png" alt="Logo" width={70} height={55} priority />
                <List>
                    {navItems.map((item) => (
                        <ListItem
                            key={item.text}
                            button
                            component="a"
                            href={item.link}
                            className={styles.listItem}
                        >
                            <ListItemText primary={item.text} className={styles.listItemText} />
                        </ListItem>
                    ))}
                    <Divider />
                </List>
            </Drawer>

            <Container className={styles.contentContainer}>
                <Typography variant="h6" className={styles.promptText}>
                    How was your day, {userName}?
                </Typography>

                <Box className={styles.dateSelector}>
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
                    className={styles.textarea}
                    placeholder="Write about your day..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                />

                <Button onClick={saveJournalEntry} variant="contained" className={styles.saveButton}>
                    Save Entry
                </Button>
            </Container>
        </Box>
    );
}