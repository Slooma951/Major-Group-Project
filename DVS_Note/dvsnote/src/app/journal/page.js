'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Button, TextField, Typography, CircularProgress, IconButton, Fab, useMediaQuery
} from '@mui/material';
import {
    Home as HomeIcon, Book as BookIcon, Checklist as ChecklistIcon, Person as PersonIcon,
    Mic as MicIcon, ArrowBackIos, ArrowForwardIos, Help as HelpIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import '../globals.css';

export default function JournalPage() {
    const router = useRouter();
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [entry, setEntry] = useState('');
    const [mood, setMood] = useState('');
    const [username, setUsername] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [showTip, setShowTip] = useState(false);
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null);
    const feelings = ['Motivated', 'Content', 'Reflective', 'Stressed'];
    const isFutureDate = selectedDate.isAfter(dayjs(), 'day');

    useEffect(() => {
        if (!localStorage.getItem('seenJournalTip')) {
            setShowTip(true);
            localStorage.setItem('seenJournalTip', 'true');
        }

        (async () => {
            const res = await fetch('/api/checkSession');
            if (res.ok) {
                const data = await res.json();
                setUsername(data.user.username);
                await fetchJournal(data.user.username, selectedDate.format('YYYY-MM-DD'));
            } else {
                router.push('/login');
            }
        })();
    }, [router]);

    useEffect(() => {
        if (username) {
            fetchJournal(username, selectedDate.format('YYYY-MM-DD'));
        }
    }, [selectedDate, username]);

    const fetchJournal = async (uname, dateStr) => {
        try {
            const res = await fetch('/api/getJournal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: uname, date: dateStr }),
            });
            const data = await res.json();
            if (res.ok && data.journal) {
                setEntry(data.journal.content || '');
                setMood(data.journal.mood || '');
            } else {
                setEntry('');
                setMood('');
            }
        } catch (err) {
            console.error('Error fetching journal:', err);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            audioChunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('audio', blob, 'entry.webm');

                const res = await fetch('/api/transcribe', {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json();
                if (data.transcript) {
                    setEntry((prev) => prev ? `${prev} ${data.transcript}` : data.transcript);
                }

                setIsRecording(false);
                mediaRecorderRef.current = null;
                streamRef.current = null;
            };

            mediaRecorderRef.current = recorder;
            streamRef.current = stream;
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Recording error:', err);
            alert('Recording failed. Make sure your microphone is allowed.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            streamRef.current?.getTracks().forEach(track => track.stop()); // stop audio stream
            mediaRecorderRef.current.stop();
        }
    };

    const saveJournal = async () => {
        if (!username || !entry.trim() || isFutureDate) return;
        setLoading(true);
        try {
            const dateStr = selectedDate.format('YYYY-MM-DD');
            await Promise.all([
                fetch('/api/saveJournal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, title: 'Journal Entry', content: entry, mood, date: dateStr }),
                }),
                fetch('/api/saveJournalEntry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, content: entry, date: dateStr, mood }),
                }),
            ]);
        } catch (error) {
            console.error('Error saving journal:', error);
        } finally {
            setLoading(false);
        }
    };

    const changeDate = (direction) => {
        setSelectedDate(prev =>
            direction === 'back' ? prev.subtract(1, 'day') : prev.add(1, 'day')
        );
    };

    const navItems = [
        { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
        { text: 'Journal', icon: <BookIcon />, link: '/journal' },
        { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
        { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
    ];

    return (
        <Box className="mainContainer" sx={{ p: { xs: 2, sm: 4 } }}>
            <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                Journal Entry
            </Typography>

            {showTip && (
                <Box sx={{
                    backgroundColor: '#eef6f9', p: '10px 16px', borderRadius: '8px',
                    fontSize: '14px', display: 'flex', justifyContent: 'space-between',
                    maxWidth: '500px', margin: '8px auto', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                }}>
                    <span>💡 You can write, speak, and log your feelings below.</span>
                    <IconButton size="small" onClick={() => setShowTip(false)}>×</IconButton>
                </Box>
            )}

            {tipModalOpen && (
                <Box sx={{
                    position: 'fixed', bottom: 80, right: 20, backgroundColor: '#fff',
                    padding: '12px 16px', borderRadius: '8px', fontSize: '13px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)', zIndex: 1300
                }}>
                    <Typography variant="body2">
                        ✨ You can write or record your journal. Tap the mic to begin.
                    </Typography>
                    <Button size="small" onClick={() => setTipModalOpen(false)} sx={{ mt: 1 }}>Close</Button>
                </Box>
            )}

            <Box display="flex" justifyContent="center" alignItems="center" mb={2} gap={2}>
                <IconButton onClick={() => changeDate('back')}><ArrowBackIos /></IconButton>
                <Typography variant="h6">{selectedDate.format('MMMM D, YYYY')}</Typography>
                <IconButton onClick={() => changeDate('forward')}><ArrowForwardIos /></IconButton>
            </Box>

            {isFutureDate && (
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                    🚫 You cannot write journal entries for future dates.
                </Typography>
            )}

            <Box className="contentContainer" sx={{ maxWidth: 500, mx: 'auto' }}>
                <TextField
                    label="Write about your day."
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    fullWidth
                    multiline
                    margin="normal"
                    rows={8}
                    disabled={isFutureDate}
                    sx={{
                        '& .MuiInputBase-root': {
                            borderRadius: 2,
                            background: '#fffaf0',
                            fontFamily: 'Georgia, serif',
                        },
                    }}
                />

                <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 2, mb: 1 }}>
                    How are you feeling today?
                </Typography>

                <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                    {feelings.map((f, i) => (
                        <Button key={i} onClick={() => setMood(f)}
                                sx={{
                                    px: 3, py: 1, minWidth: 100,
                                    fontSize: 14, fontWeight: 500,
                                    borderRadius: 25, textTransform: 'capitalize',
                                    backgroundColor: mood === f ? '#6045E2' : '#f3f0ff',
                                    color: mood === f ? '#fff' : '#333',
                                    '&:hover': { backgroundColor: mood === f ? '#503bd9' : '#e0dbff' },
                                    boxShadow: mood === f ? '0 4px 10px rgba(96,69,226,0.3)' : 'none',
                                }}>
                            {f}
                        </Button>
                    ))}
                </Box>

                <Button
                    fullWidth
                    startIcon={<MicIcon />}
                    onClick={isRecording ? stopRecording : startRecording}
                    sx={{
                        py: 1.2, mt: 1, mb: 1,
                        fontSize: 15, fontWeight: 600,
                        borderRadius: 25,
                        backgroundColor: '#dcd0ff',
                        color: '#111',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        boxShadow: '0 4px 12px rgba(176,153,255,0.3)',
                        '&:hover': { backgroundColor: '#c2b3f3' },
                        '&:active': { backgroundColor: '#b09ae9', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' },
                    }}>
                    {isRecording ? 'Stop Recording' : 'Record Journal Entry'}
                </Button>

                <Button
                    fullWidth
                    onClick={saveJournal}
                    disabled={loading || isFutureDate}
                    sx={{
                        py: 1.2, fontSize: 15, fontWeight: 600,
                        borderRadius: 25,
                        backgroundColor: '#dcd0ff',
                        color: '#111',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        boxShadow: '0 4px 12px rgba(176,153,255,0.3)',
                        '&:hover': { backgroundColor: '#c2b3f3' },
                        '&:active': { backgroundColor: '#b09ae9', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' },
                    }}>
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Saving...
                        </>
                    ) : 'Save Journal'}
                </Button>
            </Box>

            <Fab
                size="small"
                color="default"
                onClick={() => setTipModalOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: isSmallScreen ? 70 : 20,
                    right: isSmallScreen ? 16 : 30,
                    bgcolor: '#f1f1f1',
                    color: '#333',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: '#ddd' },
                    zIndex: 1301
                }}>
                <HelpIcon fontSize="small" />
            </Fab>

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