'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import styles from './dashboard.module.css';

export default function Dashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState('User');
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch('/api/checkSession');
            if (response.ok) {
                const data = await response.json();
                setUserName(data.user.username);

                // Fetch motivational quotes
                const quotesResponse = await fetch(`/api/getQuotes?username=${data.user.username}`);
                if (quotesResponse.ok) {
                    const quotesData = await quotesResponse.json();
                    setQuotes(quotesData.quotes);
                } else {
                    console.error('Failed to fetch quotes.');
                }
            } else {
                router.push('/login');
            }
        };

        fetchUserData();
    }, [router]);

    const navItems = [
        { text: 'Home', icon: <HomeIcon className={styles.navIcon} />, link: '/dashboard' },
        { text: 'Journal', icon: <BookIcon className={styles.navIcon} />, link: '/journal' },
        { text: 'To-Do List', icon: <ChecklistIcon className={styles.navIcon} />, link: '/todo' },
        { text: 'Profile', icon: <PersonIcon className={styles.navIcon} />, link: '/profile' },
    ];

    return (
        <Box className={styles.mainContainer}>
            {/* Main Content */}
            <Box className={styles.contentContainer}>
                <Typography variant="h5" className={styles.welcomeText}>
                    Welcome, {userName}
                </Typography>

                {/* Motivational Quotes Section */}
                <Box className={styles.quotesContainer}>
                    <Typography variant="h6" className={styles.quotesHeader}>
                        Motivational Quotes
                    </Typography>
                    {quotes.length > 0 ? (
                        quotes.map((quote, index) => (
                            <Typography key={index} className={styles.quote}>
                                {quote}
                            </Typography>
                        ))
                    ) : (
                        <Typography className={styles.quote}>
                            Write a journal entry to see motivational quotes!
                        </Typography>
                    )}
                </Box>

                <Button
                    variant="contained"
                    className={styles.addButton}
                    onClick={() => alert('Add New Task functionality')}
                >
                    Add New Task
                </Button>
            </Box>

            {/* Bottom Navigation */}
            <Box className={styles.bottomNav}>
                {navItems.map((item) => (
                    <Button
                        key={item.text}
                        onClick={() => router.push(item.link)}
                        className={styles.navItem}
                    >
                        {item.icon}
                        <Typography className={styles.navText}>{item.text}</Typography>
                    </Button>
                ))}
            </Box>
        </Box>
    );
}
