import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardContent,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password, navigate);
        } catch (err) {
            setError('Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={'100dvh'}
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%,rgb(75, 153, 162) 100%)',
                overflow: 'hidden'
            }}
        >
            <Card sx={{ borderRadius: 3, boxShadow: 6, padding: 2, margin: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                        MyOrg
                    </Typography>
                    <Typography variant="body2" color="textSecondary" textAlign="center" mb={3}>
                        Please sign in to continue
                    </Typography>

                    <Divider sx={{ marginBottom: 2 }} />

                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            type="email"
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                        />

                        {error && (
                            <Alert severity="error" sx={{ marginY: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ padding: 1.5, fontSize: '1rem', marginTop: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </form>

                    <Typography variant="body2" textAlign="center" mt={2}>
                        Forgot password? <a href="#" style={{ color: '#667eea', textDecoration: 'none' }}>Click here</a>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;