'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  Book as BookIcon,
  Checklist as ChecklistIcon,
  Person as PersonIcon,
  Mic as MicIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import '../globals.css';

export default function JournalPage() {
  const router = useRouter();
  const [gratitude, setGratitude] = useState('');
  const [goals, setGoals] = useState('');
  const [mood, setMood] = useState('');
  const [username, setUsername] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

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

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  const parseVoiceInput = (text) => {
    const lower = text.toLowerCase();

    const moodMatch = feelings.find(f => lower.includes(f.toLowerCase()));
    if (moodMatch) setMood(moodMatch);

    const gratitudeMatch = lower.match(/(?:grateful for|thankful for)\s(.+?)(\.|$)/i);
    if (gratitudeMatch) setGratitude(prev => prev ? `${prev} ${capitalize(gratitudeMatch[1])}` : capitalize(gratitudeMatch[1]));

    const goalMatch = lower.match(/(?:goal is|i want to|i plan to)\s(.+?)(\.|$)/i);
    if (goalMatch) setGoals(prev => prev ? `${prev} ${capitalize(goalMatch[1])}` : capitalize(goalMatch[1]));
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported.');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      parseVoiceInput(spokenText);
    };

    recognition.start();
  };

  const saveJournal = async () => {
    if (!username || (!gratitude && !goals && !mood)) return;

    setLoading(true);
    try {
      await Promise.all([
        fetch('/api/saveJournal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            title: 'Journal Entry',
            content: gratitude,
            goals,
            date,
            mood,
          }),
        }),
        fetch('/api/saveJournalEntry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, content: gratitude, date, mood }),
        }),
      ]);
    } catch (error) {
      console.error('Error saving journal:', error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Journal', icon: <BookIcon />, link: '/journal' },
    { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  ];

  return (
      <Box className="mainContainer">
        <Typography variant="h5" className="welcomeText">Your Journal</Typography>

        <Box className="contentContainer">
          <TextField
              label="Gratitude"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              fullWidth
              multiline
              margin="normal"
          />
          <TextField
              label="Goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              fullWidth
              multiline
              margin="normal"
          />
          <TextField
              label="Mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              select
              SelectProps={{ native: true }}
              fullWidth
              margin="normal"
          >
            <option value="">Select mood</option>
            {feelings.map((f, idx) => <option key={idx} value={f}>{f}</option>)}
          </TextField>
          <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
          />

          <Button startIcon={<MicIcon />} onClick={startListening} className="addButton">
            {isListening ? "Listening..." : "Voice Input"}
          </Button>
          <Button className="addButton" onClick={saveJournal} disabled={loading} style={{ marginTop: 10 }}>
            {loading ? <CircularProgress size={20} style={{ marginRight: 8, color: 'white' }} /> : null}
            {loading ? "Saving..." : "Save Journal"}
          </Button>
        </Box>

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