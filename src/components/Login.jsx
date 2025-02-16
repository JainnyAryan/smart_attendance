import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './styles/Login.module.css'
import { Box, Button, TextField } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password, navigate);
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
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
