import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './styles/Login.module.css'
import { Box, Button, TextField } from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();  
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, {
                username,
                password,
            });

            const { access_token } = response.data;
            localStorage.setItem('token', access_token); 
            login({ username }); 
            navigate('/dashboard', { replace: true }); 
        } catch (err) {
            setError('Invalid credentials');
            throw err;
        }
    };

    return (
        <div className={styles.container}>
            <h1 style={{ fontWeight: "normal", textAlign: "left" }}>Login</h1>
            <form onSubmit={handleLogin} className={styles.form}>
                <TextField
                    fullWidth
                    type="text"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    variant="outlined"
                    required
                />
                <Box height={10} />
                <TextField
                    fullWidth
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Box height={20} />
                <Button fullWidth variant="contained" type="submit">Login</Button>
            </form>
        </div>
    );
};

export default Login;
