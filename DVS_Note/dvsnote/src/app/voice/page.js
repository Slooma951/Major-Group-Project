'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SaveIcon from '@mui/icons-material/Save';
import styles from './voice.module.css';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';

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
                    setUserData({ username: data.user.username, email: data.user.email });
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
        { text: 'Home', icon: <HomeIcon className={styles.navIcon} />, link: '/dashboard' },
        { text: 'Journal', icon: <BookIcon className={styles.navIcon} />, link: '/journal' },
        { text: 'To-Do List', icon: <ChecklistIcon className={styles.navIcon} />, link: '/todo' },
        { text: 'Profile', icon: <PersonIcon className={styles.navIcon} />, link: '/profile' },
    ];

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice recognition is not supported in this browser.');
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

    // Function to save the voice data
    const saveVoiceData = async (username, transcript) => {
        const date = new Date().toISOString();
        setIsSaving(true);

        const response = await fetch('/api/voice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, transcript, date }),
        });

        const data = await response.json();
        setIsSaving(false); // End saving process

        if (data.success) {
            console.log('Voice data saved successfully!');
        } else {
            console.error('Failed to save voice data:', data.message);
        }
    };

    const handleSaveClick = () => {
        if (transcript && userData) {
            saveVoiceData(userData.username, transcript);
        } else {
            alert('Please start speaking and ensure the transcript is available.');
        }
    };

    return (
        <Box className={styles.mainContainer}>
            <Typography variant="h5" className={styles.title}>
                Voice to Text
            </Typography>

            <Box className={styles.content}>
                <Button className={styles.micButton} onClick={startListening} disabled={isListening}>
                    {isListening ? <StopIcon /> : <MicIcon />}
                    {isListening ? 'Listening...' : 'Start'}
                </Button>
                <Typography className={styles.transcript}>{transcript || 'Speak something...'}</Typography>

                {/* Save Button */}
                <Button
                    className={styles.saveButton}
                    onClick={handleSaveClick}
                    disabled={isSaving || !transcript}
                    startIcon={<SaveIcon />}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            </Box>

            {/* Bottom Navigation */}
            <Box className={styles.bottomNav}>
                {navItems.map((item) => (
                    <Link href={item.link} key={item.text} className={styles.navItem}>
                        <Button className={styles.navButton}>
                            {item.icon}
                            <Typography className={styles.navText}>{item.text}</Typography>
                        </Button>
                    </Link>
                ))}
            </Box>
        </Box>
    );
}
