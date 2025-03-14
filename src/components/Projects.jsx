import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, CircularProgress, Container, IconButton, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Projects = ({ refreshListFlag, openEditDialog }) => {
    const [projects, setProjects] = useState([]);
    const { authToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/projects/`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setProjects(projectsRes.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchData();
    }, [refreshListFlag]);

    return (
        <Container sx={{ width: "100%", maxWidth: "100vw", padding: 0 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Project List</Typography>
            <TableContainer component={Paper} sx={{ display: "block", overflowX: "auto" }}>
                <Table sx={{ width: "100%" }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell><b>Code</b></TableCell>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Description</b></TableCell>
                            <TableCell><b>Start Date</b></TableCell>
                            <TableCell><b>End Date</b></TableCell>
                            <TableCell><b>Max Team Size</b></TableCell>
                            <TableCell><b>Min Experience (years)</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell>{project.code}</TableCell>
                                <TableCell>{project.name}</TableCell>
                                <TableCell>{project.description || 'N/A'}</TableCell>
                                <TableCell>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(project.end_date).toLocaleDateString()}</TableCell>
                                <TableCell>{project.max_team_size}</TableCell>
                                <TableCell>{project.min_experience}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => openEditDialog(project)}>
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

export default Projects;