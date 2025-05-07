'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, MenuItem, Select, CircularProgress, IconButton, Fab, useMediaQuery
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
  Home as HomeIcon, Book as BookIcon, Checklist as ChecklistIcon, Person as PersonIcon, Help as HelpIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import '../globals.css';

const MOOD_COLORS = ['#4CAF50', '#8BC34A', '#FF9800', '#F44336'];
const MOODS = ['Motivated', 'Content', 'Reflective', 'Stressed'];

export default function Dashboard() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:600px)');

  const [userName, setUserName] = useState('User');
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [emotion, setEmotion] = useState('');
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0 });
  const [moodStats, setMoodStats] = useState({});
  const [taskFilter, setTaskFilter] = useState('monthly');
  const [moodFilter, setMoodFilter] = useState('monthly');
  const [showTip, setShowTip] = useState(false);
  const [tipModalOpen, setTipModalOpen] = useState(false);

  useEffect(() => {
    const tipSeen = localStorage.getItem('seenDashboardTip');
    if (!tipSeen) {
      setShowTip(true);
      localStorage.setItem('seenDashboardTip', 'true');
    }

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

        await fetchTaskData(taskFilter);
        await fetchMoodData(moodFilter);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    })();
  }, [router, taskFilter, moodFilter]);

  const fetchTaskData = async (range) => {
    const res = await fetch('/api/taskStats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ range }),
    });
    if (res.ok) {
      const data = await res.json();
      setTaskStats(data);
    }
  };

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

        {showTip && (
            <Box sx={{
              backgroundColor: '#eef6f9', color: '#333', padding: '10px 16px',
              borderRadius: '8px', fontSize: '14px', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between',
              maxWidth: '700px', margin: '8px auto', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
            }}>
              <span>💡 Your dashboard helps you track your moods and tasks. Use the filters to explore trends over time.</span>
              <IconButton size="small" onClick={() => setShowTip(false)}>×</IconButton>
            </Box>
        )}

        {tipModalOpen && (
            <Box sx={{
              position: 'fixed', bottom: 80, right: 20, backgroundColor: '#fff',
              padding: '12px 16px', borderRadius: '8px', fontSize: '13px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)', zIndex: 1300
            }}>
              <Typography variant="body2">
                📊 Use this page to see your task progress and mood trends. The filters help you zoom in by time period.
              </Typography>
              <Button size="small" onClick={() => setTipModalOpen(false)} sx={{ mt: 1 }}>Close</Button>
            </Box>
        )}

        {loading ? (
            <CircularProgress style={{ color: 'var(--primary-color)', marginTop: '20px' }} />
        ) : (
            <>
              <Typography variant="h5" className="welcomeText">Welcome, {userName}</Typography>

              <Box className="quotesContainer">
                <Typography className="quotesHeader">Today's Quote ({emotion}):</Typography>
                <Typography className="quote">"{motivationalQuote}"</Typography>
              </Box>

              {/* Responsive chart layout */}
              <Box
                  display="flex"
                  flexDirection={isMobile ? 'column' : 'row'}
                  justifyContent="center"
                  gap={3}
                  flexWrap="wrap"
                  mt={3}
              >
                <Box className="statsCard" sx={{ flex: 1, minWidth: 280 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography className="quotesHeader">Task Overview</Typography>
                    <Select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)} size="small">
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                  </Box>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={taskPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                        {taskPieData.map((entry, i) => (
                            <Cell key={i} fill={i === 0 ? '#6045E2' : '#cbc3e3'} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Box className="statsCard" sx={{ flex: 1, minWidth: 280 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography className="quotesHeader">Mood Overview</Typography>
                    <Select value={moodFilter} onChange={(e) => setMoodFilter(e.target.value)} size="small">
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                  </Box>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={moodBarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12 }} />
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
              </Box>
            </>
        )}

        <Fab
            size="small"
            color="default"
            onClick={() => setTipModalOpen(true)}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 80 : 20,
              right: isMobile ? 20 : 30,
              bgcolor: '#f1f1f1',
              color: '#333',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 1301,
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