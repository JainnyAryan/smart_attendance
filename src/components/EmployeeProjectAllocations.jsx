import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, Box, Stack, Select, MenuItem, LinearProgress, Button, Collapse
} from '@mui/material';
import axios from 'axios';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const EmployeeProjectAllocations = () => {
    const [allocations, setAllocations] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [historyMap, setHistoryMap] = useState({});
    const [expandedRows, setExpandedRows] = useState([]);
    const { authToken } = useAuth();

    useEffect(() => {
        api.get(`${import.meta.env.VITE_BASE_URL}/employee/my-project-allocations`, {
            headers: { Authorization: `Bearer ${authToken}` },
        })
            .then(response => {
                setAllocations(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching allocations:", error);
                setLoading(false);
            });

        api.get(`${import.meta.env.VITE_BASE_URL}/employee/allocation-statuses`, {
            headers: { Authorization: `Bearer ${authToken}` },
        })
            .then(response => {
                setStatusOptions(response.data);
            })
            .catch(error => {
                console.error("Error fetching status options:", error);
            });
    }, []);

    const handleStatusChange = (allocationId, newStatus) => {
        axios.put(
            `${import.meta.env.VITE_BASE_URL}/employee/allocations/${allocationId}/status`,
            { status: newStatus },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        )
            .then(response => {
                setAllocations(prevAllocations =>
                    prevAllocations.map(allocation =>
                        allocation.id === allocationId ? { ...allocation, status: newStatus } : allocation
                    )
                );
                toast.success(`Status updated to "${newStatus}"`);
            })
            .catch(error => {
                console.error("Error updating status:", error);
                toast.error("Failed to update status. Please try again.");
            });
    };

    const fetchStatusHistory = async (allocationId) => {
        if (historyMap[allocationId]) return;
        try {
            const res = await api.get(`${import.meta.env.VITE_BASE_URL}/employee/allocations/${allocationId}/status-history`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setHistoryMap(prev => ({ ...prev, [allocationId]: res.data }));
        } catch (err) {
            toast.error("Error loading status history");
            console.error(err);
        }
    };

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(prev => prev.filter(rowId => rowId !== id));
        } else {
            setExpandedRows(prev => [...prev, id]);
            fetchStatusHistory(id);
        }
    };

    function parseDuration(duration) {
        // Extract the duration parts from the 'PT' string format
        const regex = /^PT(\d+H)?(\d+M)?(\d+S)?$/;
        const match = duration.match(regex);

        if (!match) return null; // Invalid format

        // Parse hours, minutes, seconds from the regex match
        const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
        const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
        const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;

        return { hours, minutes, seconds };
    }


    if (loading) return <LinearProgress sx={{ width: "100%" }} />;

    return (
        <Box sx={{ padding: 2, width: "90%" }}>
            <Typography variant="h6" gutterBottom>
                My Project Allocations
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Project Name</TableCell>
                            <TableCell>Project Code</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Deadline</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allocations.map((allocation) => (
                            <React.Fragment key={allocation.id}>
                                <TableRow>
                                    <TableCell>{allocation.project.name}</TableCell>
                                    <TableCell>{allocation.project.code}</TableCell>
                                    <TableCell>{allocation.role}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={allocation.status}
                                            onChange={(e) => handleStatusChange(allocation.id, e.target.value)}
                                            size="small"
                                        >
                                            {statusOptions.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell>{allocation.deadline}</TableCell>
                                    <TableCell>
                                        <Button size="small" onClick={() => toggleRow(allocation.id)}>
                                            {expandedRows.includes(allocation.id) ? 'Hide History' : 'View History'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                        <Collapse in={expandedRows.includes(allocation.id)} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Status Change History:
                                                </Typography>
                                                {historyMap[allocation.id] ? (
                                                    <Stack spacing={0.5}>
                                                        {historyMap[allocation.id].map((log, idx) => {
                                                            const { hours, minutes, seconds } = parseDuration(log.duration_spent);
                                                            return (
                                                                <Typography key={idx} variant="body2">
                                                                    {log.from_status} → {log.to_status} at {new Date(log.changed_at).toLocaleString()}
                                                                    {log.duration_spent && ` (Spent: ${hours}h ${minutes}m ${seconds}s)`}
                                                                </Typography>
                                                            );
                                                        })}
                                                    </Stack>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">Loading...</Typography>
                                                )}
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EmployeeProjectAllocations;
