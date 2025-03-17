import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Shifts = ({ refreshListFlag, openEditDialog }) => {
    const [shifts, setShifts] = useState([]);
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const shiftsRes = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/shifts/`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setShifts(shiftsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refreshListFlag]);


    return (
        <Container sx={{ width: "100%", maxWidth: "100vw", padding: 0 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Shift List</Typography>
            <TableContainer component={Paper} sx={{ display: "block", overflowX: "auto" }}>
                <Table sx={{ width: "100%" }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Code</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shifts.map((shift) => (
                            <TableRow key={shift.id}>
                                <TableCell>{shift.name}</TableCell>
                                <TableCell>{shift.shift_code}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => openEditDialog(shift)}>
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Shifts;