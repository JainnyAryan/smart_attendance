import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Card, CardContent, Typography, Box, Stack, Select, MenuItem, LinearProgress
} from '@mui/material';
import axios from 'axios';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';


const EmployeeProjectAllocations = () => {
    const [allocations, setAllocations] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authToken } = useAuth();

    useEffect(() => {
        // Fetch allocations
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

        // Fetch allocation statuses
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allocations.map((allocation) => (
                            <TableRow key={allocation.id}>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default EmployeeProjectAllocations;