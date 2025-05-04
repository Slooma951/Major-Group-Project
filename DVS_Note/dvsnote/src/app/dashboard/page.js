'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  CircularProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Home as HomeIcon,
  Book as BookIcon,
  Checklist as ChecklistIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import '../globals.css';

const MOOD_COLORS = ['#4CAF50', '#8BC34A', '#FFEB3B', '#F44336'];
const MOODS = ['Great', 'Good', 'Okay', 'Not so good'];

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [emotion, setEmotion] = useState('');
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0 });
  const [moodStats, setMoodStats] = useState({});
  const [filter, setFilter] = useState('monthly');

  useEffect(() => {
    (async () => {
      try {
        const userRes = await fetch('/api/checkSession');
        if (!userRes.ok) return router.push('/login');
        const userData = await userRes.json();
        setUserName(userData.user.username);

        const quoteRes = await fetch('/api/getMotivationalQuotes');
        if (quoteRes.ok) {
          const quoteData = await quoteRes.json();
          setMotivationalQuote(quoteData.quote);
          setEmotion(quoteData.emotion);
        }

        const taskStatsRes = await fetch('/api/taskStats', { method: 'POST' });
        if (taskStatsRes.ok) {
          const taskStatsData = await taskStatsRes.json();
          setTaskStats(taskStatsData);
        }

        await fetchMoodData(filter);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    })();
  }, [router, filter]);

  const fetchMoodData = async (range) => {
    const res = await fetch('/api/moodStats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ range }),
    });
    if (res.ok) {
      const data = await res.json();
      setMoodStats(data.moodCount || {});
    }
  };

  const moodBarData = MOODS.map((mood) => ({
    name: mood,
    value: moodStats[mood] || 0,
  }));

  const taskPieData = [
    { name: 'Completed', value: taskStats.completedTasks },
    { name: 'Pending', value: taskStats.pendingTasks },
  ];

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, link: '/dashboard' },
    { text: 'Journal', icon: <BookIcon />, link: '/journal' },
    { text: 'To-Do List', icon: <ChecklistIcon />, link: '/todo' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  ];

  return (
    <Box className="mainContainer">
      <img src="/images/logo.png" alt="Logo" className="logo" />
      {loading ? (
        <CircularProgress style={{ color: 'var(--primary-color)', marginTop: '20px' }} />
      ) : (
        <>
          <Typography variant="h5" className="welcomeText">Welcome, {userName}</Typography>

          <Box className="quotesContainer">
            <Typography className="quotesHeader">Today's Quote ({emotion}):</Typography>
            <Typography className="quote">"{motivationalQuote}"</Typography>
          </Box>

          {/* Task Overview Pie Chart */}
          <Box className="statsCard">
            <Typography className="quotesHeader">Task Overview</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={taskPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {taskPieData.map((entry, i) => (
                    <Cell key={i} fill={i === 0 ? '#6045E2' : '#cbc3e3'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Mood Overview Bar Chart */}
          <Box className="statsCard">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography className="quotesHeader">Mood Overview</Typography>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)} size="small">
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </Box>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={moodBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {moodBarData.map((_, index) => (
                    <Cell key={index} fill={MOOD_COLORS[index % MOOD_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}

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
