import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Departments = ({ refreshListFlag, openEditDialog }) => {
    const [departments, setDepartments] = useState([]);
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const departmentsRes = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/departments/`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setDepartments(departmentsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refreshListFlag]);


    return (
        <Container sx={{ width: "100%", maxWidth: "100dvw", padding: 2 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Department List</Typography>
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
                        {departments.map((department) => (
                            <TableRow key={department.id}>
                                <TableCell>{department.name}</TableCell>
                                <TableCell>{department.dept_code}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => openEditDialog(department)}>
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

export default Departments;