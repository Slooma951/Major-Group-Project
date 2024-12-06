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
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [emotion, setEmotion] = useState('');

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

    const fetchMotivationalQuote = async () => {
      const response = await fetch('/api/getMotivationalQuotes');
      if (response.ok) {
        const data = await response.json();
        setMotivationalQuote(data.quote);
        setEmotion(data.emotion);
      } else {
        console.error('Failed to fetch motivational quote');
      }
    };

    fetchUserData();
    fetchMotivationalQuote();
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
          <Typography className={styles.quotesHeader}>Today's Quote ({emotion}):</Typography>
          <Typography className={styles.quote}>"{motivationalQuote}"</Typography>
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
