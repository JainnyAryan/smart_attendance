import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Edit, Delete, Menu } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconEyeCode, IconEyeEdit, IconEyeFilled } from '@tabler/icons-react';
import api from '../api/api';

const Employees = ({ refreshListFlag, openEditDialog }) => {
    const [employees, setEmployees] = useState([]);
    const { authToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeesRes = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/employees/`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setEmployees(employeesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refreshListFlag]);


    return (
        <Container sx={{ width: "100%", maxWidth: "100vw", padding: 0 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Employee List</Typography>
            <TableContainer component={Paper} sx={{ display: "block", overflowX: "auto" }}>
                <Table sx={{ width: "100%" }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell><b>Code</b></TableCell>
                            <TableCell><b>Name/Email</b></TableCell>
                            <TableCell><b>Department</b></TableCell>
                            <TableCell><b>Designation</b></TableCell>
                            <TableCell><b>Shift</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.emp_code}</TableCell>
                                <TableCell><div>{employee.name}</div><div>{employee.email}</div></TableCell>
                                <TableCell>{employee.department?.name} ({employee.department?.dept_code})</TableCell>
                                <TableCell>{employee.designation?.name}</TableCell>
                                <TableCell>{employee.shift?.name} ({employee.shift?.shift_code})</TableCell>
                                <TableCell sx={{ padding: 0 }}>
                                    <IconButton color="primary" onClick={() => openEditDialog(employee)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => navigate('/admin/employee-details-analytics', { state: { employee: employee } })}>
                                        <IconEyeFilled />
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

export default Employees;