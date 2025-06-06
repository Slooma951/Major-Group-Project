'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, TextField, Typography, IconButton, List,
  ListItem, ListItemText, ListItemSecondaryAction, Fab, useMediaQuery
} from '@mui/material';
import {
  Home as HomeIcon, Book as BookIcon, Checklist as ChecklistIcon, Person as PersonIcon,
  Edit as EditIcon, Delete as DeleteIcon, Mic as MicIcon, Check as CheckIcon,
  Undo as UndoIcon, Help as HelpIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import '../globals.css';

export default function ToDoList() {
  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
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
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

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

    if (lowerText.includes('high priority')) {
      parsedImportance = 'High';
      lowerText = lowerText.replace('high priority', '');
    } else if (lowerText.includes('medium priority')) {
      parsedImportance = 'Medium';
      lowerText = lowerText.replace('medium priority', '');
    } else if (lowerText.includes('low priority')) {
      parsedImportance = 'Low';
      lowerText = lowerText.replace('low priority', '');
    }

    lowerText = lowerText.replace(/\bat\b/g, '');

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

    const timeMatch = lowerText.match(/(\d{1,2})(:\d{2})?\s*([ap]\.?m\.?)/i);
    if (timeMatch) {
      const hour = timeMatch[1];
      const minute = timeMatch[2] ? timeMatch[2].replace(':', '') : '00';
      const ampm = timeMatch[3].toLowerCase().replace(/\./g, '');
      let hourNum = parseInt(hour, 10);
      if (ampm === 'pm' && hourNum < 12) hourNum += 12;
      if (ampm === 'am' && hourNum === 12) hourNum = 0;
      parsedTime = `${hourNum.toString().padStart(2, '0')}:${minute}`;
      lowerText = lowerText.replace(timeMatch[0], '');
    }

    const finalTask = lowerText.replace('set', '').replace('task', '').replace('for', '').trim();
    return { parsedDate, parsedTime, finalTask, parsedImportance };
  };

  const startListening = async () => {
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
        formData.append('audio', blob, 'task.webm');

        const res = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.transcript) {
          const cleanedTranscript = data.transcript
              .replace(/\s+([.,!?])/g, '$1')
              .replace(/\s{2,}/g, ' ')
              .trim();

          const { parsedDate, parsedTime, finalTask, parsedImportance } = parseVoiceInput(cleanedTranscript);

          if (finalTask) {
            const cleanTask = capitalizeFirst(finalTask.replace(/[.,!?]+$/, '').trim());
            setTask(cleanTask);
          }

          if (parsedDate) setDate(parsedDate);
          if (parsedTime) setTime(parsedTime);
          if (parsedImportance) setImportance(parsedImportance);
        }

        setIsListening(false);
        mediaRecorderRef.current = null;
        streamRef.current = null;
      };

      mediaRecorderRef.current = recorder;
      streamRef.current = stream;
      recorder.start();
      setIsListening(true);
    } catch (err) {
      console.error('Recording error:', err);
      alert('Microphone access failed.');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current) {
      streamRef.current?.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current.stop();
    }
  };

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const addTask = async () => {
    if (!task.trim() || !date.trim() || !time.trim()) return;
    const response = await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: task, date, time, status, importance }),
    });
    if (response.ok) {
      fetchTasks();
      clearInputs();
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;
    const response = await fetch('/api/todo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: editingTask, title: task, date, time, status, importance }),
    });
    if (response.ok) {
      setEditingTask(null);
      clearInputs();
      fetchTasks();
    }
  };

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
              <span>💡 Say: “Set buy groceries for tomorrow at 5 PM high priority.” 🎤 Add tasks with voice or keyboard. Choose a date, time, and priority. Tap ✓ to complete.</span>
              <Button size="small" onClick={() => setShowTip(false)}>×</Button>
            </Box>
        )}

        {tipModalOpen && (
            <Box sx={{
              position: 'fixed',
              bottom: 'calc(env(safe-area-inset-bottom) + 80px)',
              right: 20,
              backgroundColor: '#fff',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              zIndex: 1300
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
          <Button
              fullWidth
              startIcon={<MicIcon />}
              onClick={isListening ? stopListening : startListening}
              sx={{
                py: 1.2,
                mt: 1,
                mb: 1,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: '25px',
                backgroundColor: '#dcd0ff',
                color: '#111',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(176,153,255,0.3)',
                '&:hover': { backgroundColor: '#c2b3f3' },
                '&:active': {
                  backgroundColor: '#b09ae9',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                },
              }}
          >
            {isListening ? 'Stop Recording' : 'Voice Input'}
          </Button>

          <Button
              fullWidth
              onClick={editingTask ? updateTask : addTask}
              sx={{
                py: 1.2,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: '25px',
                backgroundColor: '#dcd0ff',
                color: '#111',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(176,153,255,0.3)',
                '&:hover': { backgroundColor: '#c2b3f3' },
                '&:active': {
                  backgroundColor: '#b09ae9',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                },
              }}
          >
            {editingTask ? 'Update Task' : 'Add Task'}
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
              bottom: 'calc(env(safe-area-inset-bottom) + 70px)',
              right: isSmallScreen ? 16 : 30,
              bgcolor: '#f1f1f1',
              color: '#333',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#ddd' },
              zIndex: 1301
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