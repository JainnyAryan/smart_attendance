import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Accordion, AccordionDetails, AccordionSummary, Box, Chip, Container,
    Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Button, Typography
} from '@mui/material';
import { Edit, ExpandMore, AddCircleOutline, Close, People } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';
import EditFurtherProjectDetailsDialog from './EditFurtherProjectDetailsDialog';
import AllocateProjectEmployees from './AllocateProjectEmployees';

const Projects = ({ refreshListFlag, triggerRefreshListFlag, openEditDialog }) => {
    const [projects, setProjects] = useState([]);
    const { authToken } = useAuth();
    const [openDialog, setOpenDialog] = useState(false);

    const [selectedProjectForFurtherEdit, setSelectedProjectForFurtherEdit] = useState(null);
    const [selectedProjectForAllocEmp, setSelectedProjectForAllocEmp] = useState(null);

    const [skillInput, setSkillInput] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const statusOptions = {
        PLANNED: "Planned",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
        ON_HOLD: "On Hold",
    }
    const priorityOptions = {
        LOW: "Low",
        MEDIUM: "Medium",
        HIGH: "High",
    }

    const [assignDialog, setAssignDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ shift: '', designation: '', department: '' });
    const handleSearchChange = (e) => setSearchQuery(e.target.value);
    const handleFilterChange = (field, value) => setFilters({ ...filters, [field]: value });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectsRes = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/projects/`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setProjects(projectsRes.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchData();
    }, [refreshListFlag]);

    const handleOpenEditDialog = (project) => {
        setSelectedProject(project);
        setSkillInput('');
        setPriority(priorityOptions[project.priority.toUpperCase()]);
        setStatus(priorityOptions[project.status.toUpperCase()]);
        setOpenDialog(true);
    };

    const handleOpenAssignDialog = (project) => {
        setSelectedProject(project);
        fetchEmployees(); // Fetch employees if needed
        setAssignDialog(true);
    };


    const handleCloseDialog = () => {
        setSelectedProject(null);
        setSkillInput('');
        setOpenDialog(false);
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !selectedProject.required_skills.includes(skillInput.trim())) {
            setSelectedProject((prev) => ({
                ...prev,
                required_skills: [...prev.required_skills, skillInput.trim()],
            }));
        }
        setSkillInput('');
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSelectedProject((prev) => ({
            ...prev,
            required_skills: prev.required_skills.filter((skill) => skill !== skillToRemove),
        }));
    };

    const handleSaveSkillsStatusPriority = async () => {
        try {
            await api.put(
                `${import.meta.env.VITE_BASE_URL}/admin/projects/${selectedProject.id}`,
                {
                    required_skills: selectedProject.required_skills,
                    status: status,
                    priority: priority,
                },  // ✅ Sending as JSON object
                { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
            );
            toast.success("Skills updated successfully.");
            triggerRefreshListFlag();
        } catch (error) {
            toast.error("Failed to update skills.");
            console.error("Error updating skills:", error.response?.data || error.message);
        }
        handleCloseDialog();
    };

    return (
        <Container sx={{ width: "100%", maxWidth: "100dvw", padding: 2 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Project List</Typography>
            <TableContainer component={Paper} sx={{ display: "block", overflowX: "auto" }}>
                <Table sx={{ width: "100%" }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell><b>Code</b></TableCell>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Priority</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                            <TableCell><b>Start Date</b></TableCell>
                            <TableCell><b>End Date</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project) => (
                            <React.Fragment key={project.id}>
                                {/* Collapsible Row */}
                                <TableRow>
                                    <TableCell>{project.code}</TableCell>
                                    <TableCell>{project.name}</TableCell>
                                    <TableCell>{project.priority.toUpperCase()}</TableCell>
                                    <TableCell>{project.status}</TableCell>
                                    <TableCell>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(project.end_date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => openEditDialog(project)}>
                                            <Edit />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>

                                {/* Expanded Row with More Details */}
                                <TableRow>
                                    <TableCell colSpan={100} sx={{ padding: 0, borderBottom: "none" }}>
                                        <Accordion sx={{ boxShadow: "none", backgroundColor: "#f9f9f9" }}>
                                            <AccordionSummary expandIcon={<ExpandMore />} sx={{ padding: "0 16px" }}>
                                                <Typography variant="body2" color="primary">
                                                    View More Details
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography><b>Description:</b> {project.description || "N/A"}</Typography>
                                                <Typography><b>Max Team Size:</b> {project.max_team_size}</Typography>
                                                <Typography><b>Min Experience (years):</b> {project.min_experience}</Typography>

                                                {/* Skills */}
                                                <Box mt={2}>
                                                    <Typography><b>Required Skills:</b></Typography>
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                                                        {project.required_skills.length > 0 ? (
                                                            project.required_skills.map((skill, index) => (
                                                                <Chip key={index} label={skill} variant="outlined" />
                                                            ))
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">No skills listed.</Typography>
                                                        )}
                                                    </Box>
                                                </Box>

                                                {/* Buttons for Editing & Assigning Employees */}
                                                <Box sx={{
                                                    mt: 2, display: "flex", flexWrap: "wrap",
                                                    gap: 2
                                                }}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<Edit />}
                                                        onClick={() => setSelectedProjectForFurtherEdit(project)}
                                                    >
                                                        Edit Project Further
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color='secondary'
                                                        startIcon={<People />}
                                                        onClick={() => setSelectedProjectForAllocEmp(project)}
                                                    >
                                                        Employee Allocation
                                                    </Button>
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Skills Dialog */}
            {selectedProjectForFurtherEdit && (
                <EditFurtherProjectDetailsDialog
                    open={!!selectedProjectForFurtherEdit}
                    onClose={() => setSelectedProjectForFurtherEdit(null)}
                    project={selectedProjectForFurtherEdit}
                    triggerRefresh={triggerRefreshListFlag}
                />
            )}

            {/* Emp Alloc Dialog */}
            {selectedProjectForAllocEmp && (
                <AllocateProjectEmployees
                    open={!!selectedProjectForAllocEmp}
                    onClose={() => setSelectedProjectForAllocEmp(null)}
                    project={selectedProjectForAllocEmp}
                    triggerRefresh={triggerRefreshListFlag}
                />
            )}
        </Container>
    );
};

export default Projects;