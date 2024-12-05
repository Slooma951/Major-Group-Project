'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextareaAutosize,
  Typography,
  IconButton,
} from '@mui/material';
import dayjs from 'dayjs';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from 'next/navigation';
import styles from './journal.module.css';

export default function Journal() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Fetch user data and session
  useEffect(() => {
    const fetchUserData = async () => {
      try {
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

  // Fetch the journal for the selected date
  useEffect(() => {
    const fetchJournal = async () => {
      try {
        if (!userName) return;

        const response = await fetch('/api/getJournal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: userName,
            date: selectedDate.format('YYYY-MM-DD'),
          }),
        });

        const data = await response.json();
        if (data.success) {
          if (data.journal) {
            // Update title and content if journal is found
            setJournalTitle(data.journal.title || '');
            setJournalEntry(data.journal.content || '');
          } else {
            // Reset title and content if no journal is found for the date
            setJournalTitle('');
            setJournalEntry('');
          }
        } else {
          console.error('Failed to fetch journal entry:', data.message);
          setJournalTitle('');
          setJournalEntry('');
        }
      } catch (error) {
        console.error('Error fetching journal:', error);
        setJournalTitle('');
        setJournalEntry('');
      }
    };
    fetchJournal();
  }, [selectedDate, userName]);

  const saveJournal = async () => {
    try {
      if (!userName) {
        router.push('/login');
        return;
      }

      const firstLine = journalEntry.split('\n')[0];
      const title = firstLine.trim().length > 0 ? firstLine.trim() : 'Untitled';

      const response = await fetch('/api/saveJournal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userName,
          title,
          content: journalEntry,
          date: selectedDate.format('YYYY-MM-DD'),
        }),
      });

      if (!response.ok) {
        console.error('Error saving journal to journals collection');
      }
    } catch (error) {
      console.error('Error saving journal:', error);
    }
  };

  const saveJournalEntry = async () => {
    try {
      if (!userName) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/saveJournalEntry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userName,
          journalEntry,
          date: selectedDate.format('YYYY-MM-DD'),
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Entry saved successfully to journalEntries!');
      } else {
        console.error(data.message || 'Failed to save entry to journalEntries!');
      }
    } catch (error) {
      console.error('Error saving journal entry to journalEntries:', error);
    }
  };

  const handleSave = () => {
    // Save to journals table (title & content)
    saveJournal();

    // Save to journalEntries table (emotions, keywords)
    saveJournalEntry();
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Journal', icon: <BookIcon />, link: '/journal' },
    { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  ];

  const goToPreviousDay = () => {
    setSelectedDate(selectedDate.subtract(1, 'day'));
  };

  const goToNextDay = () => {
    const today = dayjs();
    if (!selectedDate.isSame(today, 'day')) {
      setSelectedDate(selectedDate.add(1, 'day'));
    }
  };

  return (
    <Box className={styles.mainContainer}>
      {/* Header with Date Navigation */}
      <Box className={styles.header}>
        <Typography variant="h6" className={styles.promptText}>
          Dear Future Me
        </Typography>
        <Box className={styles.datePickerContainer}>
          <IconButton
            className={styles.dateNavigationButton}
            onClick={goToPreviousDay}
            disabled={selectedDate.isBefore(dayjs('2000-01-01'), 'day')}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography className={styles.datePickerInput}>
            {selectedDate.format('YYYY-MM-DD')}
          </Typography>
          <IconButton
            className={styles.dateNavigationButton}
            onClick={goToNextDay}
            disabled={selectedDate.isSame(dayjs(), 'day')}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Display the title if available */}
      {journalTitle && (
        <Typography
          variant="h5"
          style={{ marginTop: '16px', textAlign: 'center', fontWeight: 'bold' }}
        >
          {journalTitle}
        </Typography>
      )}

      {/* Text Area */}
      <TextareaAutosize
        minRows={15}
        className={styles.textarea}
        placeholder="Write your day and express your emotions..."
        value={journalEntry}
        onChange={(e) => setJournalEntry(e.target.value)}
      />

      {/* Save Button */}
      <Button className={styles.saveButton} onClick={handleSave}>
        Save Entry
      </Button>

      {/* Bottom Navigation Bar */}
      <Box className={styles.bottomNav}>
        {navItems.map((item) => (
          <Button
            key={item.text}
            className={styles.navItem}
            onClick={() => router.push(item.link)}
          >
            {item.icon}
            <Typography variant="caption">{item.text}</Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
}
