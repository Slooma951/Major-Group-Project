'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextareaAutosize,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import dayjs from 'dayjs';
import {
  Home as HomeIcon,
  Book as BookIcon,
  Checklist as ChecklistIcon,
  Person as PersonIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import styles from './journal.module.css';

export default function Journal() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/checkSession');
      if (res.ok) {
        const data = await res.json();
        setUserName(data.user.username);
      } else {
        router.push('/login');
      }
    })();
  }, [router]);

  useEffect(() => {
    if (!userName) return;
    (async () => {
      const res = await fetch('/api/getJournal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, date: selectedDate.format('YYYY-MM-DD') }),
      });
      const data = await res.json();
      if (res.ok && data.journal) {
        setJournalTitle(data.journal.title || '');
        setJournalEntry(data.journal.content || '');
      } else {
        setJournalTitle('');
        setJournalEntry('');
      }
    })();
  }, [selectedDate, userName]);

  const saveJournal = async () => {
    if (!userName || !journalEntry || !selectedDate) return;
    const title = journalEntry.split('\n')[0].trim() || 'Untitled';
    await fetch('/api/saveJournal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userName, title, content: journalEntry, date: selectedDate.format('YYYY-MM-DD') }),
    });
  };

  const saveJournalEntryAnalysis = async () => {
    if (!userName || !journalEntry || !selectedDate) return;
    await fetch('/api/saveJournalEntry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userName, content: journalEntry, date: selectedDate.format('YYYY-MM-DD') }),
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveJournal();
      await saveJournalEntryAnalysis();
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousDay = () => setSelectedDate(selectedDate.subtract(1, 'day'));
  const goToNextDay = () => {
    if (!selectedDate.isSame(dayjs(), 'day')) setSelectedDate(selectedDate.add(1, 'day'));
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Journal', icon: <BookIcon />, link: '/journal' },
    { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  ];

  return (
    <Box className={styles.mainContainer}>
      <Box className={styles.header}>
        <Typography variant="h6" className={styles.promptText}>Dear Me</Typography>
        <Box className={styles.datePickerContainer}>
          <IconButton className={styles.dateNavigationButton} onClick={goToPreviousDay} disabled={selectedDate.isBefore(dayjs('2000-01-01'), 'day')}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography className={styles.datePickerInput}>{selectedDate.format('YYYY-MM-DD')}</Typography>
          <IconButton className={styles.dateNavigationButton} onClick={goToNextDay} disabled={selectedDate.isSame(dayjs(), 'day')}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>

      {journalTitle && (
        <Typography variant="h5" style={{ marginTop: '16px', textAlign: 'center', fontWeight: 'bold' }}>
          {journalTitle}
        </Typography>
      )}

      <TextareaAutosize
        minRows={15}
        className={styles.textarea}
        placeholder="Write your day and express your emotions..."
        value={journalEntry}
        onChange={(e) => setJournalEntry(e.target.value)}
      />

      <Button className={styles.saveButton} onClick={handleSave} disabled={loading}>
        {loading ? (
          <>
            <CircularProgress size={20} style={{ marginRight: 8 }} />
            Saving...
          </>
        ) : (
          'Save Entry'
        )}
      </Button>

      <Box className={styles.bottomNav}>
        {navItems.map((item) => (
          <Button key={item.text} className={styles.navItem} onClick={() => router.push(item.link)}>
            {item.icon}
            <Typography variant="caption">{item.text}</Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
}
