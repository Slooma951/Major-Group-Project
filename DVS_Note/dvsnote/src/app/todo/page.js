'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import {
    Home as HomeIcon,
    Book as BookIcon,
    Checklist as ChecklistIcon,
    Person as PersonIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import styles from './todo.module.css';

export default function ToDoList() {
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await fetch('/api/todo');
        const data = await response.json();
        if (data.success) {
            setTasks(data.tasks);
        }
    };

    const addTask = async () => {
        if (!task.trim() || !description.trim() || !date.trim() || !time.trim()) return;
        
        const response = await fetch('/api/todo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: task, description, date, time }),
        });

        if (response.ok) {
            fetchTasks();
            setTask('');
            setDescription('');
            setDate('');
            setTime('');
        }
    };

    const editTask = (task) => {
        setEditingTask(task._id);
        setTask(task.title);
        setDescription(task.description);
        setDate(task.date);
        setTime(task.time);
    };

    const updateTask = async () => {
        if (!editingTask) return;

        const response = await fetch('/api/todo', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: editingTask, title: task, description, date, time }),
        });

        if (response.ok) {
            setEditingTask(null);
            setTask('');
            setDescription('');
            setDate('');
            setTime('');
            fetchTasks();
        }
    };

    const deleteTask = async (taskId) => {
        const response = await fetch('/api/todo', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId }),
        });

        if (response.ok) {
            fetchTasks();
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
            {/* Header */}
            <Box className={styles.header}>
                <Typography variant="h6" className={styles.promptText}>
                    Your To-Do List
                </Typography>
            </Box>

            {/* Add Task Section */}
            <Box className={styles.centerContent}>
                <Typography variant="h6" className={styles.promptText}>
                    {editingTask ? "Edit Task" : "Add a Task"}
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
                <Button 
                    className={styles.addButton} 
                    onClick={editingTask ? updateTask : addTask} 
                    variant="contained"
                >
                    {editingTask ? "Update Task" : "Add Task"}
                </Button>
            </Box>

            {/* Task List */}
            <Box className={styles.taskList}>
                <Typography variant="h6" className={styles.promptText}>
                    Your Tasks
                </Typography>
                <List>
                    {tasks.map((task) => (
                        <ListItem key={task._id} divider>
                            <ListItemText
                                primary={task.title}
                                secondary={`${task.description} | ${task.date} at ${task.time}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => editTask(task)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" onClick={() => deleteTask(task._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Bottom Navigation */}
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
