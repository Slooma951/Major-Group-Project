'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Home as HomeIcon, Book as BookIcon, Checklist as ChecklistIcon, Person as PersonIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import '../globals.css';

const TASK_COLORS = ['#6045E2', '#cbc3e3'];
const MOOD_COLORS = ['#4CAF50', '#8BC34A', '#FFEB3B', '#F44336']; // Green, Light Green, Yellow, Red

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [emotion, setEmotion] = useState('');
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0 });
  const [moodCount, setMoodCount] = useState({ Great: 0, Good: 0, Okay: 0, 'Not so good': 0 });

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

        const moodStatsRes = await fetch('/api/moodStats', { method: 'POST' });
        if (moodStatsRes.ok) {
          const moodStatsData = await moodStatsRes.json();
          setMoodCount(moodStatsData.moodCount);
        }

      } catch {
        // Keep defaults if error
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const taskPieData = [
    { name: 'Completed', value: taskStats.completedTasks },
    { name: 'Pending', value: taskStats.pendingTasks },
  ];

  const moodPieData = [
    { name: 'Great', value: moodCount.Great },
    { name: 'Good', value: moodCount.Good },
    { name: 'Okay', value: moodCount.Okay },
    { name: 'Not so good', value: moodCount['Not so good'] },
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
          <Typography variant="h5" className="welcomeText">
            Welcome, {userName}
          </Typography>

          <Box className="quotesContainer">
            <Typography className="quotesHeader">Today's Quote ({emotion}):</Typography>
            <Typography className="quote">"{motivationalQuote}"</Typography>
          </Box>

          {/* Task Overview - Pie Chart */}
          <Box className="statsCard">
            <Typography className="quotesHeader">Task Overview</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={taskPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {taskPieData.map((entry, index) => (
                    <Cell key={`task-cell-${index}`} fill={TASK_COLORS[index % TASK_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Mood Overview - Pie Chart */}
          <Box className="statsCard">
            <Typography className="quotesHeader">Mood Overview</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={moodPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {moodPieData.map((entry, index) => (
                    <Cell key={`mood-cell-${index}`} fill={MOOD_COLORS[index % MOOD_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
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
