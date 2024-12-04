'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AppBar, Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemText, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function Dashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState('User');
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
                const response = await fetch('/api/checkSession');
                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.user.username);
                } else {
                    router.push('/login');
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
        <Box className={styles.mainContainer}>
            {/* AppBar */}
            <AppBar position="static" className={styles.appBar}>
                <Toolbar className={styles.toolbar}>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" className={styles.title}>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Main Container */}
            <Container className={styles.contentContainer}>
                {/* Drawer */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    classes={{ paper: styles.drawerPaper }}
                >
                    <Image src="/images/logo.png" alt="Logo" width={70} height={55} priority />
                    <List className={styles.drawerList}>
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

                {/* Main Content */}
                <Box className={styles.mainContent}>
                    <Typography variant="h5" className={styles.welcomeText}>
                        Welcome, {userName}
                    </Typography>
                    <Button variant="contained" fullWidth className={styles.addButton}>
                        Add New Task
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
