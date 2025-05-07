// Cleaned and styled ToDoList component
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Home as HomeIcon,
  Book as BookIcon,
  Checklist as ChecklistIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mic as MicIcon,
  Check as CheckIcon,
  Undo as UndoIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import '../globals.css';

export default function ToDoList() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [importance, setImportance] = useState('Low');
  const [editingTask, setEditingTask] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/todo');
    const data = await res.json();
    if (data.success) setTasks(data.tasks);
  };

  const clearInputs = () => {
    setTask('');
    setDate('');
    setTime('');
    setImportance('Low');
    setEditingTask(null);
  };

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleVoiceInput = (text) => {
    const lower = text.toLowerCase();
    let finalTask = lower.replace(/(set|task|for|high|medium|low|priority|today|tomorrow|\bat\b)/g, '').trim();
    const parsedImportance = lower.includes('high') ? 'High' : lower.includes('medium') ? 'Medium' : 'Low';
    const parsedDate = lower.includes('tomorrow')
      ? dayjs().add(1, 'day').format('YYYY-MM-DD')
      : dayjs().format('YYYY-MM-DD');

    const timeMatch = lower.match(/(\d{1,2})(:\d{2})?\s*(am|pm)/);
    const parsedTime = timeMatch ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]?.slice(1) || '00'}` : '';

    setTask(capitalizeFirst(finalTask));
    setDate(parsedDate);
    if (parsedTime) setTime(parsedTime);
    setImportance(parsedImportance);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) return alert('Voice recognition not supported');
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => handleVoiceInput(e.results[0][0].transcript);
    recognition.start();
  };

  const handleSubmit = async () => {
    if (!task || !date || !time) return;
    const method = editingTask ? 'PUT' : 'POST';
    const body = editingTask
      ? { taskId: editingTask, title: task, date, time, status: 'Pending', importance }
      : { title: task, date, time, status: 'Pending', importance };

    await fetch('/api/todo', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    fetchTasks();
    clearInputs();
  };

  const toggleStatus = async (task) => {
    const updated = { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' };
    await fetch('/api/todo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    fetchTasks();
  };

  const deleteTask = async (taskId) => {
    await fetch('/api/todo', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });
    fetchTasks();
  };

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Journal', icon: <BookIcon />, link: '/journal' },
    { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  ];

  return (
    <Box className="mainContainer">
      <Typography variant="h5" className="welcomeText">To-Do List</Typography>

      <Box className="contentContainer">
        <TextField label="Task" fullWidth value={task} onChange={(e) => setTask(capitalizeFirst(e.target.value))} margin="normal" />
        <TextField label="Date" type="date" fullWidth value={date} onChange={(e) => setDate(e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="Time" type="time" fullWidth value={time} onChange={(e) => setTime(e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="Importance" select value={importance} onChange={(e) => setImportance(e.target.value)} SelectProps={{ native: true }} fullWidth margin="normal">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </TextField>
        <Button onClick={startListening} startIcon={<MicIcon />} className="addButton">{isListening ? 'Listening...' : 'Voice Input'}</Button>
        <Button onClick={handleSubmit} className="addButton">{editingTask ? 'Update Task' : 'Add Task'}</Button>
      </Box>

      <Box className="contentContainer">
        <Typography variant="h6" className="welcomeText">Tasks</Typography>
        <List>
          {tasks.map((t) => (
            <ListItem key={t._id} divider className="boxContainer">
              <ListItemText
                primary={<span style={{ fontWeight: 'bold', color: t.status === 'Completed' ? 'green' : '#000' }}>[{t.importance}] {t.title}</span>}
                secondary={`${t.date} at ${t.time} | Status: ${t.status}`}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => toggleStatus(t)}>{t.status === 'Completed' ? <UndoIcon /> : <CheckIcon />}</IconButton>
                <IconButton onClick={() => editTask(t)}><EditIcon /></IconButton>
                <IconButton onClick={() => deleteTask(t._id)}><DeleteIcon /></IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
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
