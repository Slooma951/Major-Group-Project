"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Home as HomeIcon,
  Book as BookIcon,
  Checklist as ChecklistIcon,
  Person as PersonIcon,
  Mic as MicIcon,
  ArrowBackIos,
  ArrowForwardIos,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import "../globals.css";

export default function JournalPage() {
  const router = useRouter();
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");
  const [username, setUsername] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const feelings = ["Motivated", "Content", "Reflective", "Stressed"];

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/checkSession");
      if (res.ok) {
        const data = await res.json();
        setUsername(data.user.username);
        await fetchJournal(data.user.username, selectedDate.format("YYYY-MM-DD"));
      } else {
        router.push("/login");
      }
    })();
  }, [router]);

  useEffect(() => {
    if (username) {
      fetchJournal(username, selectedDate.format("YYYY-MM-DD"));
    }
  }, [selectedDate, username]);

  const fetchJournal = async (uname, dateStr) => {
    try {
      const res = await fetch("/api/getJournal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: uname, date: dateStr }),
      });
      const data = await res.json();
      if (res.ok && data.journal) {
        setEntry(data.journal.content || "");
        setMood(data.journal.mood || "");
      } else {
        setEntry("");
        setMood("");
      }
    } catch (err) {
      console.error("Error fetching journal:", err);
    }
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported.");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setEntry((prev) => (prev ? `${prev} ${spokenText}` : spokenText));
    };

    recognition.start();
  };

  const saveJournal = async () => {
    if (!username || !entry.trim()) return;
    setLoading(true);
    try {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      await Promise.all([
        fetch("/api/saveJournal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            title: "Journal Entry",
            content: entry,
            mood,
            date: dateStr,
          }),
        }),
        fetch("/api/saveJournalEntry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, content: entry, date: dateStr, mood }),
        }),
      ]);
    } catch (error) {
      console.error("Error saving journal:", error);
    } finally {
      setLoading(false);
    }
  };

  const changeDate = (direction) => {
    setSelectedDate((prev) =>
      direction === "back" ? prev.subtract(1, "day") : prev.add(1, "day")
    );
  };

  const navItems = [
    { text: "Home", icon: <HomeIcon />, link: "/dashboard" },
    { text: "Journal", icon: <BookIcon />, link: "/journal" },
    { text: "To-Do List", icon: <ChecklistIcon />, link: "/todo" },
    { text: "Profile", icon: <PersonIcon />, link: "/profile" },
  ];

  return (
    <Box className="mainContainer">
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Journal Entry
      </Typography>

      <Box display="flex" justifyContent="center" alignItems="center" mb={2} gap={2}>
        <IconButton onClick={() => changeDate("back")}><ArrowBackIos /></IconButton>
        <Typography variant="h6">{selectedDate.format("MMMM D, YYYY")}</Typography>
        <IconButton onClick={() => changeDate("forward")}><ArrowForwardIos /></IconButton>
      </Box>

      <Box className="contentContainer" sx={{ maxWidth: 500, margin: "auto" }}>
        <TextField
          label="Write about your day."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          fullWidth
          multiline
          margin="normal"
          rows={8}
          sx={{ '& .MuiInputBase-root': { borderRadius: 2, background: '#fffaf0', fontFamily: 'Georgia, serif' } }}
        />

        <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 2, mb: 1 }}>
          How are you feeling today?
        </Typography>

        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mb={2}>
          {feelings.map((f, i) => (
            <Button
              key={i}
              onClick={() => setMood(f)}
              sx={{
                px: 3, py: 1, minWidth: 100,
                fontSize: 14, fontWeight: 500, borderRadius: 25,
                textTransform: "capitalize",
                boxShadow: mood === f ? '0 4px 10px rgba(96,69,226,0.3)' : 'none',
                backgroundColor: mood === f ? '#6045E2' : '#f3f0ff',
                color: mood === f ? '#fff' : '#333',
                '&:hover': { backgroundColor: mood === f ? '#503bd9' : '#e0dbff' },
              }}
            >{f}</Button>
          ))}
        </Box>

        <Button
          fullWidth
          startIcon={<MicIcon />}
          onClick={startListening}
          sx={{
            py: 1.2, mt: 1, mb: 1,
            fontSize: 15, fontWeight: 600,
            borderRadius: 25,
            backgroundColor: '#dcd0ff',
            color: '#111',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            boxShadow: '0 4px 12px rgba(176,153,255,0.3)',
            '&:hover': { backgroundColor: '#c2b3f3' },
            '&:active': { backgroundColor: '#b09ae9', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' },
          }}
        >{isListening ? 'Listening...' : 'Speak Journal Entry'}</Button>

        <Button
          fullWidth
          onClick={saveJournal}
          disabled={loading}
          sx={{
            py: 1.2,
            fontSize: 15, fontWeight: 600,
            borderRadius: 25,
            backgroundColor: '#dcd0ff',
            color: '#111',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            boxShadow: '0 4px 12px rgba(176,153,255,0.3)',
            '&:hover': { backgroundColor: '#c2b3f3' },
            '&:active': { backgroundColor: '#b09ae9', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' },
          }}
        >{loading ? <><CircularProgress size={20} sx={{ mr: 1 }} /> Saving...</> : 'Save Journal'}</Button>
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
