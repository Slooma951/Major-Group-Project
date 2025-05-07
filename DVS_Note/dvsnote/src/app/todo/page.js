// Cleaned and styled ToDoList component
'use client';

import React, { useState, useEffect } from 'react';
import {
<<<<<<< HEAD
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
=======
    Box, Button, TextField, Typography, IconButton, List,
    ListItem, ListItemText, ListItemSecondaryAction, Fab
} from '@mui/material';
import {
    Home as HomeIcon, Book as BookIcon, Checklist as ChecklistIcon, Person as PersonIcon,
    Edit as EditIcon, Delete as DeleteIcon, Mic as MicIcon, Check as CheckIcon,
    Undo as UndoIcon, Help as HelpIcon
>>>>>>> 2e09ea54d4753fefeb28ca2c1ba006fd47f58ad3
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import '../globals.css';

export default function ToDoList() {
<<<<<<< HEAD
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
=======
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [status, setStatus] = useState('Pending');
    const [importance, setImportance] = useState('Low');
    const [editingTask, setEditingTask] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const [tipModalOpen, setTipModalOpen] = useState(false);

    useEffect(() => {
        const tipSeen = localStorage.getItem('seenTodoTip');
        if (!tipSeen) {
            setShowTip(true);
            localStorage.setItem('seenTodoTip', 'true');
        }
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await fetch('/api/todo');
        const data = await response.json();
        if (data.success) setTasks(data.tasks);
    };

    const parseVoiceInput = (text) => {
        let lowerText = text.toLowerCase();
        let parsedDate = '', parsedTime = '', parsedImportance = 'Low';
>>>>>>> 2e09ea54d4753fefeb28ca2c1ba006fd47f58ad3

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleVoiceInput = (text) => {
    const lower = text.toLowerCase();
    let finalTask = lower.replace(/(set|task|for|high|medium|low|priority|today|tomorrow|\bat\b)/g, '').trim();
    const parsedImportance = lower.includes('high') ? 'High' : lower.includes('medium') ? 'Medium' : 'Low';
    const parsedDate = lower.includes('tomorrow')
      ? dayjs().add(1, 'day').format('YYYY-MM-DD')
      : dayjs().format('YYYY-MM-DD');

<<<<<<< HEAD
    const timeMatch = lower.match(/(\d{1,2})(:\d{2})?\s*(am|pm)/);
    const parsedTime = timeMatch ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]?.slice(1) || '00'}` : '';
=======
        if (lowerText.includes('today')) {
            parsedDate = dayjs().format('YYYY-MM-DD');
            lowerText = lowerText.replace('today', '');
        } else if (lowerText.includes('tomorrow')) {
            parsedDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
            lowerText = lowerText.replace('tomorrow', '');
        } else {
            const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const todayIndex = dayjs().day();
            weekdays.forEach((day, idx) => {
                if (lowerText.includes(day)) {
                    let daysToAdd = (idx + 1) - todayIndex;
                    if (daysToAdd <= 0) daysToAdd += 7;
                    parsedDate = dayjs().add(daysToAdd, 'day').format('YYYY-MM-DD');
                    lowerText = lowerText.replace(day, '');
                }
            });
        }
>>>>>>> 2e09ea54d4753fefeb28ca2c1ba006fd47f58ad3

    setTask(capitalizeFirst(finalTask));
    setDate(parsedDate);
    if (parsedTime) setTime(parsedTime);
    setImportance(parsedImportance);
  };

<<<<<<< HEAD
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
=======
        const finalTask = lowerText.replace('set', '').replace('task', '').replace('for', '').trim();
>>>>>>> 2e09ea54d4753fefeb28ca2c1ba006fd47f58ad3

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

<<<<<<< HEAD
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
=======
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            const { parsedDate, parsedTime, finalTask, parsedImportance } = parseVoiceInput(spokenText);
            if (finalTask) setTask(capitalizeFirst(finalTask));
            if (parsedDate) setDate(parsedDate);
            if (parsedTime) setTime(parsedTime);
            if (parsedImportance) setImportance(parsedImportance);
        };
>>>>>>> 2e09ea54d4753fefeb28ca2c1ba006fd47f58ad3

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Journal', icon: <BookIcon />, link: '/journal' },
    { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  ];

<<<<<<< HEAD
  return (
    <Box className="mainContainer">
      <Typography variant="h5" className="welcomeText">To-Do List</Typography>
=======
    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
>>>>>>> 2e09ea54d4753fefeb28ca2c1ba006fd47f58ad3

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

<<<<<<< HEAD
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
=======
    const toggleStatus = async (task) => {
        const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
        const response = await fetch('/api/todo', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskId: task._id,
                title: task.title,
                date: task.date,
                time: task.time,
                status: newStatus,
                importance: task.importance,
            }),
        });
        if (response.ok) fetchTasks();
    };

    const deleteTask = async (taskId) => {
        const response = await fetch('/api/todo', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId }),
        });
        if (response.ok) fetchTasks();
    };

    const editTask = (task) => {
        setEditingTask(task._id);
        setTask(task.title);
        setDate(task.date);
        setTime(task.time);
        setStatus(task.status || 'Pending');
        setImportance(task.importance || 'Low');
    };

    const clearInputs = () => {
        setTask('');
        setDate('');
        setTime('');
        setStatus('Pending');
        setImportance('Low');
    };

    const navItems = [
        { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
        { text: 'Journal', icon: <BookIcon />, link: '/journal' },
        { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
        { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
    ];

    return (
        <Box className="mainContainer">
            <Typography variant="h5" className="welcomeText">Your To-Do List</Typography>

            {showTip && (
                <Box sx={{
                    backgroundColor: '#eef6f9',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: '600px',
                    margin: '10px auto',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                }}>
                    <span>💡 Say: “Set buy groceries for tomorrow at 5 PM high priority.”

                            🎤 Add tasks with voice or keyboard. Choose a date, time, and priority. Tap ✓ to complete.</span>
                    <Button size="small" onClick={() => setShowTip(false)}>×</Button>
                </Box>
            )}

            {tipModalOpen && (
                <Box sx={{
                    position: 'fixed', bottom: 70, right: 20,
                    backgroundColor: '#fff',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                    <Typography variant="body2">
                        🎤 To use voice input, say something like: “Set buy milk for tomorrow at 9 AM high priority.”
                    </Typography>
                    <Button size="small" onClick={() => setTipModalOpen(false)} sx={{ mt: 1 }}>Close</Button>
                </Box>
            )}

            <Box className="contentContainer">
                <Typography variant="h6" className="welcomeText">{editingTask ? "Edit Task" : "Add a Task"}</Typography>
                <TextField label="Task" variant="outlined" value={task} onChange={(e) => setTask(capitalizeFirst(e.target.value))} fullWidth margin="normal" />
                <TextField label="Date" type="date" variant="outlined" value={date} onChange={(e) => setDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                <TextField label="Time" type="time" variant="outlined" value={time} onChange={(e) => setTime(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                <TextField select label="Importance" value={importance} onChange={(e) => setImportance(e.target.value)} SelectProps={{ native: true }} fullWidth margin="normal">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </TextField>
                <Button startIcon={<MicIcon />} onClick={startListening} className="addButton">
                    {isListening ? "Listening..." : "Voice Input"}
                </Button>
                <Button className="addButton" onClick={editingTask ? updateTask : addTask}>
                    {editingTask ? "Update Task" : "Add Task"}
                </Button>
            </Box>

            <Box className="contentContainer">
                <Typography variant="h6" className="welcomeText">Your Tasks</Typography>
                <List>
                    {tasks.map((task) => (
                        <ListItem key={task._id} divider className="boxContainer">
                            <ListItemText
                                primary={<span style={{ fontWeight: 'bold', color: task.status === 'Completed' ? 'green' : 'black' }}>[{task.importance}] {task.title}</span>}
                                secondary={<span style={{ color: '#555' }}>{task.date} at {task.time} | Status: {task.status}</span>}
                            />
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => toggleStatus(task)}>{task.status === 'Completed' ? <UndoIcon /> : <CheckIcon />}</IconButton>
                                <IconButton onClick={() => editTask(task)}><EditIcon /></IconButton>
                                <IconButton onClick={() => deleteTask(task._id)}><DeleteIcon /></IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Fab
                size="small"
                color="default"
                onClick={() => setTipModalOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    bgcolor: '#f1f1f1',
                    color: '#333',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: '#ddd' }
                }}
            >
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
>>>>>>> 2e09ea54d4753fefeb28ca2c1ba006fd47f58ad3
