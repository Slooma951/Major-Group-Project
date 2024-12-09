
'use client';

import React, { useState } from 'react';
import { Box, Button, TextareaAutosize, Typography } from '@mui/material';
import {
    Home as HomeIcon,
    Book as BookIcon,
    Checklist as ChecklistIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import styles from './todo.module.css';

export default function ToDoList() {
    const router = useRouter();
    const [taskInput, setTaskInput] = useState('');

    const addTask = () => {
        if (taskInput.trim()) {
            setTaskInput('');
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
                    Your To-Do List
                </Typography>
            </Box>

            {/* Centered Task Input directly in the center */}
            <Box className={styles.centerContent}>
                <Typography variant="h6" className={styles.promptText}>
                    Add a Task
                </Typography>
                {/* Add task input */}
                <TextareaAutosize
                    className={styles.taskInput}
                    placeholder="Add a new task..."
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                />
                <Button className={styles.addButton} onClick={addTask}>
                    Add Task
                </Button>
            </Box>

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