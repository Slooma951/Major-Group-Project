'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextareaAutosize,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  Book as BookIcon,
  Favorite as HeartIcon,
  Person as PersonIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import styles from '@/app/journal/journal.module.css';

export default function Journal() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [gratitudeEntry, setGratitudeEntry] = useState('');
  const [goalsEntry, setGoalsEntry] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const feelings = ['Great', 'Good', 'Okay', 'Not so good'];

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/checkSession');
      if (res.ok) {
        const data = await res.json();
        setUsername(data.user.username);
      } else {
        router.push('/login');
      }
    })();
  }, [router]);

  useEffect(() => {
    if (!username) return;
    fetchJournalEntry();
  }, [selectedDate, username]);

  const fetchJournalEntry = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/getJournal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          date: selectedDate.format('YYYY-MM-DD'),
        }),
      });

      const data = await res.json();
      if (res.ok && data.journal) {
        setGratitudeEntry(data.journal.content || '');
        setGoalsEntry(data.journal.goals || '');
      } else {
        setGratitudeEntry('');
        setGoalsEntry('');
      }
    } catch (error) {
      console.error('Error fetching journal:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveJournalAndEmotions = async () => {
    if (!username || (!gratitudeEntry && !goalsEntry) || !selectedDate) return;

    setLoading(true);
    try {
      await Promise.all([
        fetch('/api/saveJournal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            title: "Journal Entry",
            content: gratitudeEntry.trim() || '',
            goals: goalsEntry.trim() || '',
            date: selectedDate.format('YYYY-MM-DD'),
          }),
        }),
        fetch('/api/saveJournalEntry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, content: gratitudeEntry, date: selectedDate.format('YYYY-MM-DD') }),
        }),
      ]);
    } catch (error) {
      console.error('Error saving journal:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousDay = () => setSelectedDate(selectedDate.subtract(1, 'day'));
  const goToNextDay = () => {
    if (!selectedDate.isSame(dayjs(), 'day')) setSelectedDate(selectedDate.add(1, 'day'));
  };

  return (
      <Box className={styles.mainContainer}>
        {/* Header with Date Navigation */}
        <Box className={styles.header}>
          <Typography variant="h6" className={styles.promptText}>Journal</Typography>
          <Box className={styles.datePickerContainer}>
            <IconButton className={styles.dateNavigationButton} onClick={goToPreviousDay}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography className={styles.datePickerInput}>{selectedDate.format('MMMM D, YYYY')}</Typography>
            <IconButton className={styles.dateNavigationButton} onClick={goToNextDay} disabled={selectedDate.isSame(dayjs(), 'day')}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Gratitude Section */}
        <Box className={styles.inputContainer}>
          <Typography variant="body1" className={styles.promptText}>Today I'm grateful for...</Typography>
          <TextareaAutosize
              minRows={3}
              className={styles.textarea}
              placeholder="Write your thoughts here..."
              value={gratitudeEntry}
              onChange={(e) => setGratitudeEntry(e.target.value)}
          />
        </Box>

        {/* Goals Section */}
        <Box className={styles.inputContainer}>
          <Typography variant="body1" className={styles.promptText}>What would make today great?</Typography>
          <TextareaAutosize
              minRows={3}
              className={styles.textarea}
              placeholder="List 3 things that would make today great..."
              value={goalsEntry}
              onChange={(e) => setGoalsEntry(e.target.value)}
          />
        </Box>

        {/* Mood Section */}
        <Box className={styles.inputContainer}>
          <Typography variant="body1" className={styles.promptText}>How are you feeling today?</Typography>
          <Box className={styles.feelingContainer}>
            {feelings.map((feeling, index) => (
                <Button key={index} className={styles.feelingButton}>
                  {feeling}
                </Button>
            ))}
          </Box>
        </Box>

        {/* Save Button */}
        <Button className={styles.saveButton} onClick={saveJournalAndEmotions} disabled={loading}>
          {loading ? (
              <>
                <CircularProgress size={20} style={{ marginRight: 8 }} />
                Saving...
              </>
          ) : (
              'Save Journal'
          )}
        </Button>

        {/* Bottom Navigation */}
        <Box className={styles.bottomNav}>
          <Button className={styles.navItem} onClick={() => router.push('/dashboard')}>
            <HomeIcon />
            <Typography variant="caption">Home</Typography>
          </Button>
          <Button className={styles.navItem} onClick={() => router.push('/journal')}>
            <BookIcon />
            <Typography variant="caption">Journal</Typography>
          </Button>
          <Button className={styles.navItem} onClick={() => router.push('/todo')}>
            <HeartIcon />
            <Typography variant="caption">ToDo</Typography>
          </Button>
          <Button className={styles.navItem} onClick={() => router.push('/profile')}>
            <PersonIcon />
            <Typography variant="caption">Profile</Typography>
          </Button>
        </Box>
      </Box>
  );
}
