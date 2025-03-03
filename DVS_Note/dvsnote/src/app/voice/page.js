'use client';

import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import styles from './voice.module.css';

export default function VoiceToText() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

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

    return (
        <Box className={styles.mainContainer}>
            <Typography variant="h5" className={styles.title}>Voice to Text</Typography>

            <Box className={styles.content}>
                <Button className={styles.micButton} onClick={startListening} disabled={isListening}>
                    {isListening ? <StopIcon /> : <MicIcon />}
                    {isListening ? 'Listening...' : 'Start'}
                </Button>
                <Typography className={styles.transcript}>{transcript || 'Speak something...'}</Typography>
            </Box>
        </Box>
    );
}
