'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Home as HomeIcon,
  Book as BookIcon,
  Checklist as ChecklistIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [emotion, setEmotion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const userRes = await fetch('/api/checkSession');
        if (!userRes.ok) return router.push('/login');
        const userData = await userRes.json();
        setUserName(userData.user.username);

        const quoteRes = await fetch('/api/getMotivationalQuotes');
        if (quoteRes.ok) {
          const quoteData = await quoteRes.json();
          setMotivationalQuote(quoteData.quote);
          setEmotion(quoteData.emotion);
        }
      } catch {
        // If errors occur, user stays "User" and quotes remain empty.
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const navItems = [
    { text: 'Home', icon: <HomeIcon className={styles.navIcon} />, link: '/dashboard' },
    { text: 'Journal', icon: <BookIcon className={styles.navIcon} />, link: '/journal' },
    { text: 'To-Do List', icon: <ChecklistIcon className={styles.navIcon} />, link: '/todo' },
    { text: 'Profile', icon: <PersonIcon className={styles.navIcon} />, link: '/profile' },
  ];

  return (
    <Box className={styles.mainContainer}>
      {/* Header with Logo */}
      <Box className={styles.header}>
        <img src="/images/logo.png" alt="Logo" className={styles.logo} />
     
    {(
          <>
            <Typography variant="h5" className={styles.welcomeText}>
              Welcome, {userName}
            </Typography>

            <Box className={styles.quotesContainer}>
              <Typography className={styles.quotesHeader}>Today's Quote ({emotion}):</Typography>
              <Typography className={styles.quote}>"{motivationalQuote}"</Typography>
            </Box>

        
          </>
        )}
      </Box>

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