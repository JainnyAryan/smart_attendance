import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Container, Paper, Select, MenuItem, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography, IconButton,
    TextField,
    InputAdornment
} from '@mui/material';
import { Edit, Email, Search } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IconEyeFilled } from '@tabler/icons-react';
import api from '../api/api';

const Employees = ({ refreshListFlag, openEditDialog }) => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [filters, setFilters] = useState({
        search_query: '',
        shift_id: '',
        department_id: '',
        designation_id: '',
    });
    const [shifts, setShifts] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const { authToken } = useAuth();
    const navigate = useNavigate();

    // Function to filter employees based on selected filters
    const filterEmployees = (name, value) => {
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);

        const filtered = employees.filter(employee => {
            const search_query = updatedFilters.search_query.trim().toLowerCase();
            return (
                (search_query === '' || employee.name.toLowerCase().includes(search_query) || employee.email.toLowerCase().includes(search_query) || employee.emp_code.toLowerCase().includes(search_query)) &&
                (updatedFilters.shift_id === '' || employee.shift?.id === updatedFilters.shift_id) &&
                (updatedFilters.department_id === '' || employee.department?.id === updatedFilters.department_id) &&
                (updatedFilters.designation_id === '' || employee.designation?.id === updatedFilters.designation_id)
            );
        });

        setFilteredEmployees(filtered);
    };

    // Fetch all data on mount or when refreshListFlag changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeesRes = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/employees/`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                const [shiftsRes, departmentsRes, designationsRes] = await Promise.all([
                    api.get(`${import.meta.env.VITE_BASE_URL}/admin/shifts/`, {
                        headers: { Authorization: `Bearer ${authToken}` },
                    }),
                    api.get(`${import.meta.env.VITE_BASE_URL}/admin/departments/`, {
                        headers: { Authorization: `Bearer ${authToken}` },
                    }),
                    api.get(`${import.meta.env.VITE_BASE_URL}/admin/designations/`, {
                        headers: { Authorization: `Bearer ${authToken}` },
                    })
                ]);

                setEmployees(employeesRes.data);
                setFilteredEmployees(employeesRes.data);
                setShifts(shiftsRes.data);
                setDepartments(departmentsRes.data);
                setDesignations(designationsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refreshListFlag]);

    return (
        <Container sx={{ width: "100%", maxWidth: "100dvw", padding: 2 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Employee List</Typography>

            {/* Search and Filter Section */}
            <TextField label="Search by name/code/email"
                value={filters.search_query}
                onChange={(e) => filterEmployees('search_query', e.target.value)}
                fullWidth
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }
                }}
            />
            <Box mt={2} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 2 }}>

                <Select
                    displayEmpty
                    value={filters.department_id}
                    onChange={(e) => filterEmployees("department_id", e.target.value)}
                >
                    <MenuItem value="">All Departments</MenuItem>
                    {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                    ))}
                </Select>

                <Select
                    displayEmpty
                    value={filters.designation_id}
                    onChange={(e) => filterEmployees("designation_id", e.target.value)}
                >
                    <MenuItem value="">All Designations</MenuItem>
                    {designations.map((desig) => (
                        <MenuItem key={desig.id} value={desig.id}>{desig.name}</MenuItem>
                    ))}
                </Select>

                <Select
                    displayEmpty
                    value={filters.shift_id}
                    onChange={(e) => filterEmployees("shift_id", e.target.value)}
                >
                    <MenuItem value="">All Shifts</MenuItem>
                    {shifts.map((shift) => (
                        <MenuItem key={shift.id} value={shift.id}>{shift.name}</MenuItem>
                    ))}
                </Select>

            </Box>

            {/* Employee Table */}
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
                        {filteredEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.emp_code}</TableCell>
                                <TableCell>
                                    <div>{employee.name}</div>
                                    <div>{employee.email}</div>
                                </TableCell>
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
        </Container >
    );
};

export default Employees;