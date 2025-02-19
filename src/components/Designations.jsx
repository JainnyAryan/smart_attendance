import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Designations = ({ refreshListFlag, openEditDialog }) => {
    const [designations, setDesignations] = useState([]);
    const {authToken} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const designationsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/designations/`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setDesignations(designationsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refreshListFlag]);


    return (
        <Container sx={{ width: "100%", maxWidth: "100vw", padding: 0 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Designation List</Typography>
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
                        {designations.map((designation) => (
                            <TableRow key={designation.id}>
                                <TableCell>{designation.name}</TableCell>
                                <TableCell>{designation.designation_code}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => openEditDialog(designation)}>
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

export default Designations;