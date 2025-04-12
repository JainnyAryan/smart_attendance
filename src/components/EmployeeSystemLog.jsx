import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Stack,
    Divider
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../api/api';

const EmployeeSystemLog = () => {
    const [logStatus, setLogStatus] = useState(null);
    const [mostRecentLog, setMostRecentLog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user, authToken } = useAuth();
    const empId = user.employee.id;

    useEffect(() => {
        const fetchLogStatus = async () => {
            try {
                setLoading(true);
                const response = await api.get(
                    `${import.meta.env.VITE_BASE_URL}/employee/system-log/employee/latest/${empId}`,
                    {
                        headers: { 'Authorization': `Bearer ${authToken}` }
                    }
                );
                const logs = response.data;
                const mostRecentLog = logs;
                setMostRecentLog(mostRecentLog);

                if (mostRecentLog?.start_time && !mostRecentLog?.end_time) {
                    setLogStatus('logged_in');
                } else if (mostRecentLog?.start_time && mostRecentLog?.end_time) {
                    setLogStatus('logged_out');
                } else {
                    setLogStatus(null);
                }
            } catch (err) {
                if (err.response?.status !== 404) {
                    toast.error('Failed to fetch log status.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchLogStatus();
    }, [logStatus]);

    const fetchClientIp = async () => {
        const res = await fetch("https://api.ipify.org?format=json", {
            method: "GET",
            credentials: "omit", // 👈 prevents CORS error
        });
        const data = await res.json();
        return data.ip;
    };

    const handleLogIn = async () => {
        try {
            setLoading(true);
            await api.post(`${import.meta.env.VITE_BASE_URL}/employee/system-log/in/`, {
                emp_id: empId,
                ip_address: await fetchClientIp(),
                start_time: new Date().toISOString()
            },
                {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                }
            );
            setLogStatus('logged_in');
            toast.success('Successfully logged in!');
        } catch (err) {
            toast.error('Failed to log in.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogOut = async () => {
        try {
            setLoading(true);
            await api.post(`${import.meta.env.VITE_BASE_URL}/employee/system-log/out`, {
                emp_id: empId,
                ip_address: await fetchClientIp(),
                end_time: new Date().toISOString()
            }, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            setLogStatus('logged_out');
            toast.success('Successfully logged out!');
        } catch (err) {
            toast.error('Failed to log out.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Card sx={{ width: { xl: '600px', lg: '400px' }, padding: 3, borderRadius: 3, boxShadow: 5 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        System Log
                    </Typography>
                    <Divider sx={{ marginBottom: 3 }} />

                    {loading ? (
                        <Box display="flex" justifyContent="center" my={2}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Stack spacing={2} alignItems="center">
                                {logStatus === 'logged_in' && (
                                    <Alert severity="success" sx={{ width: '100%' }}>
                                        Last Logged In at {new Date(mostRecentLog?.start_time).toLocaleString()}
                                    </Alert>
                                )}

                                {logStatus === 'logged_out' && (
                                    <Alert severity="info" sx={{ width: '100%' }}>
                                        Last Logged Out at {new Date(mostRecentLog?.end_time).toLocaleString()}
                                    </Alert>
                                )}

                                {logStatus !== 'logged_in' && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleLogIn}
                                        fullWidth
                                        disabled={logStatus === 'logged_in' || loading}
                                    >
                                        Log In Now
                                    </Button>
                                )}

                                {logStatus === 'logged_in' && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleLogOut}
                                        fullWidth
                                        disabled={logStatus !== 'logged_in' || loading}
                                    >
                                        Log Out Now
                                    </Button>
                                )}
                            </Stack>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default EmployeeSystemLog;