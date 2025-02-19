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
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const addTask = async () => {
        if (!task.trim() || !description.trim() || !date.trim() || !time.trim()) {
            setError("All fields are required.");
            return;
        }
        setError('');
        setSuccess('');

        const response = await fetch('/api/todo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: task, description, date, time }),
        });

        const data = await response.json();
        if (response.ok) {
            setSuccess("Task added successfully!");
            setTask('');
            setDescription('');
            setDate('');
            setTime('');
        } else {
            setError(data.message || "Error adding task.");
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
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="primary">{success}</Typography>}
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
