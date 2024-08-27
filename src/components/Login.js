import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
            const response = await axios.post('http://localhost:8080/api/v1/users/login', {
                headers: { Authorization: authHeader }
            });

            localStorage.setItem('auth', authHeader);
            onLogin();
        } catch (err) {
            setError('Invalid username or password');
            console.error('Login error', err);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Login
                </Button>
            </form>
        </Box>
    );
};

export default Login;
