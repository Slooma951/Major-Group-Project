import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AppBar, Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemText, TextareaAutosize, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';

export default function Journal() {
    const router = useRouter();
    const [userName, setUserName] = useState('User');  // Adjusted to be dynamic as needed
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [journalEntry, setJournalEntry] = useState('');

    useEffect(() => {
        if (!userName) {
            router.push('/login');
        }
    }, [router, userName]);

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const saveJournalEntry = async () => {
        try {
            const response = await fetch('/api/saveJournalEntry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ journalEntry, userName }),
            });
            const data = await response.json();
            if (data.success) {
                alert('Entry saved successfully!');
                setJournalEntry('');
            } else {
                alert('Failed to save entry!');
            }
        } catch (error) {
            console.error('Failed to save journal entry:', error);
            alert('Error saving entry!');
        }
    };

    const navItems = [
        { text: 'Dashboard', link: '/dashboard' },
        { text: 'Notes', link: '/notes' },
        { text: 'To-Do List', link: '/todo' },
        { text: 'Account Details', link: '/account' },
        { text: 'Logout', link: '/logout' }
    ];

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
            padding: 3
        }}>
            <Container sx={{
                width: 290,
                height: 500,
                bgcolor: 'background.paper',
                boxShadow: 3,
                borderRadius: '25px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}>
                <AppBar position="static" sx={{
                    bgcolor: '#505c75',
                    borderTopLeftRadius: '25px',
                    borderTopRightRadius: '25px',
                    width: '800px',
                    boxShadow: 'none',
                }}>
                    <Toolbar sx={{ width: 200 }}>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: 'common.white' }}>
                            Journal
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            position: 'absolute',
                            left: '41.3%',
                            top: '32%',
                            transform: 'translate(-50%, -50%)',
                            width: '250px',
                            height: '50vh',
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
                        },
                    }}
                    ModalProps={{
                        keepMounted: true,
                    }}
                >
                    <Image src="/images/logo.png" alt="Logo" width={100} height={100} priority />
                    <List sx={{ width: '100%' }}>
                        {navItems.map((item) => (
                            <ListItem button key={item.text} component="a" href={item.link} sx={{ textAlign: 'center', justifyContent: 'center' }}>
                                <ListItemText primary={item.text} sx={{ textAlign: 'center', fontWeight: 'bold', color: '#505c75' }} />
                            </ListItem>
                        ))}
                        <Divider />
                    </List>
                </Drawer>

                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3
                }}>
                    <Typography variant="h5" gutterBottom sx={{
                        fontFamily: 'Nunito, sans-serif',
                        fontWeight: 'bold',
                        color: '#505c75',
                        mb: 3
                    }}>
                        How was your day?
                    </Typography>

                    <TextareaAutosize
                        minRows={5}
                        style={{
                            width: '80%',
                            fontSize: '16px',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '2px solid #505c75',
                            outline: 'none',
                            resize: 'none',
                            boxShadow: 'inset 0px 0px 8px rgba(0,0,0,0.1)'
                        }}
                        placeholder="Write about your day..."
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                    />

                    <Button
                        onClick={saveJournalEntry}
                        variant="contained"
                        sx={{
                            bgcolor: '#505c75',
                            color: 'common.white',
                            ':hover': { bgcolor: '#404f65' },
                            borderRadius: '20px',
                            padding: '10px 20px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                            mt: 2
                        }}
                    >
                        Save Entry
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
