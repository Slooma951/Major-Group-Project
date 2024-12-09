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
        console.error('Error fetching user data:', error.message || error);
        router.push('/login');
      }
    };
    fetchUserData();
  }, [router]);

  // Fetch the journal for the selected date
  useEffect(() => {
    const fetchJournal = async () => {
      if (!userName) return;

      try {
        const response = await fetch('/api/getJournal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: userName,
            date: selectedDate.format('YYYY-MM-DD'),
          }),
        });

        const data = await response.json();
        if (response.ok && data.journal) {
          setJournalTitle(data.journal.title || '');
          setJournalEntry(data.journal.content || '');
        } else {
          setJournalTitle('');
          setJournalEntry('');
        }
      } catch (error) {
        console.error('Error fetching journal:', error.message || error);
      }
    };
    fetchJournal();
  }, [selectedDate, userName]);

  // Save the journal entry
  const saveJournal = async () => {
    if (!userName || !journalEntry || !selectedDate) {
      console.warn('Missing required fields for saving the journal.');
      return;
    }

    const title = journalEntry.split('\n')[0].trim() || 'Untitled';

    try {
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
        console.warn('Error saving journal:', await response.text());
      }
    } catch (error) {
      console.error('Error saving journal:', error.message || error);
    }
  };

  // Save journal entry for analysis
  const saveJournalEntry = async () => {
    if (!userName || !journalEntry || !selectedDate) {
      console.warn('Missing required fields for saving journal entry.');
      return;
    }

    try {
      const response = await fetch('/api/saveJournalEntry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userName,
          content: journalEntry,
          date: selectedDate.format('YYYY-MM-DD'),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.warn('Failed to save journal entry:', data.message);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error.message || error);
    }
  };

  const handleSave = async () => {
    await saveJournal();
    await saveJournalEntry();
  };

  const goToPreviousDay = () => setSelectedDate(selectedDate.subtract(1, 'day'));
  const goToNextDay = () => {
    if (!selectedDate.isSame(dayjs(), 'day')) {
      setSelectedDate(selectedDate.add(1, 'day'));
    }
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Journal', icon: <BookIcon />, link: '/journal' },
    { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  ];

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

        {/* Display Title */}
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
