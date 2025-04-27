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
import '../globals.css';

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
        // Leave defaults if errors occur
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Journal', icon: <BookIcon />, link: '/journal' },
    { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  ];

  return (
    <Box className="mainContainer">
      <img src="/images/logo.png" alt="Logo" className="logo" />

      {loading ? (
        <CircularProgress style={{ color: 'var(--primary-color)', marginTop: '20px' }} />
      ) : (
        <>
          <Typography variant="h5" className="welcomeText">
            Welcome, {userName}
          </Typography>

          <Box className="quotesContainer">
            <Typography className="quotesHeader">Today's Quote ({emotion}):</Typography>
            <Typography className="quote">"{motivationalQuote}"</Typography>
          </Box>
        </>
      )}

      <Box className="bottomNav">
        {navItems.map((item) => (
          <Button key={item.text} className="navItem" onClick={() => router.push(item.link)}>
            {item.icon}
            <Typography variant="caption">{item.text}</Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
}
