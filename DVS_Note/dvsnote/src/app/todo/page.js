'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
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
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const addTask = () => {
        if (task.trim() && description.trim() && date.trim() && time.trim()) {
            console.log({ task, description, date, time }); // Handle task submission logic here
            setTask('');
            setDescription('');
            setDate('');
            setTime('');
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
            <Box className={styles.header}>
                <Typography variant="h6" className={styles.promptText}>
                    Your To-Do List
                </Typography>
            </Box>

            <Box className={styles.centerContent}>
                <Typography variant="h6" className={styles.promptText}>
                    Add a Task
                </Typography>
                <TextField
                    className={styles.taskInput}
                    label="Task"
                    variant="outlined"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    className={styles.taskInput}
                    label="Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    className={styles.taskInput}
                    label="Date"
                    type="date"
                    variant="outlined"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    className={styles.taskInput}
                    label="Time"
                    type="time"
                    variant="outlined"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <Button className={styles.addButton} onClick={addTask} variant="contained">
                    Add Task
                </Button>
            </Box>

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
