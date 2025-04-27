'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';
import '../globals.css';

export default function VoiceToText() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [userData, setUserData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/checkSession');
                if (response.ok) {
                    const data = await response.json();
                    setUserData({ username: data.user.username });
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

    const navItems = [
        { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
        { text: 'Journal', icon: <BookIcon />, link: '/journal' },
        { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
        { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
    ];

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
            const text = event.results[0][0].transcript;
            setTranscript(text);
        };

        recognition.start();
    };

    const saveVoiceData = async (username, transcript) => {
        const date = new Date().toISOString();
        setIsSaving(true);

        const response = await fetch('/api/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, transcript, date }),
        });

        const data = await response.json();
        setIsSaving(false);

        if (!data.success) {
            console.error('Failed to save:', data.message);
        }
    };

    const handleSaveClick = () => {
        if (transcript && userData) {
            saveVoiceData(userData.username, transcript);
        } else {
            alert('No transcript to save.');
        }
    };

    return (
        <Box className="mainContainer">
            <Typography variant="h5" className="welcomeText">Voice to Text</Typography>

            <Box className="contentContainer">
                <Button className="addButton" onClick={startListening} disabled={isListening}>
                    {isListening ? <StopIcon /> : <MicIcon />}
                    &nbsp; {isListening ? 'Listening...' : 'Start'}
                </Button>

                <Typography style={{ margin: '20px 0', color: '#333', minHeight: '60px' }}>
                    {transcript || 'Speak something...'}
                </Typography>

                <Button
                    className="addButton"
                    onClick={handleSaveClick}
                    disabled={isSaving || !transcript}
                    startIcon={<SaveIcon />}
                >
                    {isSaving ? 'Saving...' : 'Save'}
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
