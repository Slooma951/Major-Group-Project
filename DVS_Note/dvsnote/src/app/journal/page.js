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
import '../globals.css';

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
    <Box className="mainContainer">
      {/* Header with Date Navigation */}
      <Typography variant="h5" className="welcomeText">Journal</Typography>
      <Box className="contentContainer">
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <IconButton onClick={goToPreviousDay}>
            <ArrowBackIosIcon style={{ color: 'var(--primary-color)' }} />
          </IconButton>
          <Typography style={{ color: '#ccc', margin: '0 10px' }}>
            {selectedDate.format('MMMM D, YYYY')}
          </Typography>
          <IconButton onClick={goToNextDay} disabled={selectedDate.isSame(dayjs(), 'day')}>
            <ArrowForwardIosIcon style={{ color: 'var(--primary-color)' }} />
          </IconButton>
        </Box>

        {/* Gratitude Section */}
        <Box className="boxContainer">
          <Typography className="quotesHeader">Today I'm grateful for...</Typography>
          <TextareaAutosize
            minRows={3}
            placeholder="Write your thoughts here..."
            value={gratitudeEntry}
            onChange={(e) => setGratitudeEntry(e.target.value)}
            style={{ width: '100%', background: 'transparent', color: '#ccc', border: 'none', resize: 'none' }}
          />
        </Box>

        {/* Goals Section */}
        <Box className="boxContainer">
          <Typography className="quotesHeader">What would make today great?</Typography>
          <TextareaAutosize
            minRows={3}
            placeholder="List 3 things that would make today great..."
            value={goalsEntry}
            onChange={(e) => setGoalsEntry(e.target.value)}
            style={{ width: '100%', background: 'transparent', color: '#ccc', border: 'none', resize: 'none' }}
          />
        </Box>

        {/* Mood Section */}
        <Box className="boxContainer">
          <Typography className="quotesHeader">How are you feeling today?</Typography>
          <Box style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {feelings.map((feeling, index) => (
              <Button key={index} className="addButton" style={{ margin: '5px', padding: '8px 12px', minWidth: '100px' }}>
                {feeling}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Save Button */}
        <Button className="addButton" onClick={saveJournalAndEmotions} disabled={loading}>
          {loading ? (
            <>
              <CircularProgress size={20} style={{ marginRight: 8, color: 'white' }} />
              Saving...
            </>
          ) : (
            'Save Journal'
          )}
        </Button>
      </Box>

      {/* Bottom Navigation */}
      <Box className="bottomNav">
        <Button className="navItem" onClick={() => router.push('/dashboard')}>
          <HomeIcon />
          <Typography variant="caption">Home</Typography>
        </Button>
        <Button className="navItem" onClick={() => router.push('/journal')}>
          <BookIcon />
          <Typography variant="caption">Journal</Typography>
        </Button>
        <Button className="navItem" onClick={() => router.push('/todo')}>
          <HeartIcon />
          <Typography variant="caption">ToDo</Typography>
        </Button>
        <Button className="navItem" onClick={() => router.push('/profile')}>
          <PersonIcon />
          <Typography variant="caption">Profile</Typography>
        </Button>
      </Box>
    </Box>
  );
}
