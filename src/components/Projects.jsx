import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Accordion, AccordionDetails, AccordionSummary, Box, Chip, Container,
    Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Button, Typography
} from '@mui/material';
import { Edit, ExpandMore, AddCircleOutline, Close } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Projects = ({ refreshListFlag, triggerRefreshListFlag, openEditDialog }) => {
    const [projects, setProjects] = useState([]);
    const { authToken } = useAuth();
    const [selectedProject, setSelectedProject] = useState(null);
    const [skillInput, setSkillInput] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

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

    const handleOpenDialog = (project) => {
        setSelectedProject(project);
        setOpenDialog(true);
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

    const handleSaveSkills = async () => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BASE_URL}/admin/projects/required-skills/${selectedProject.id}`,
                { required_skills: selectedProject.required_skills },  // ✅ Sending as JSON object
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
        <Container sx={{ width: "100%", maxWidth: "100vw", padding: 0 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>Project List</Typography>
            <TableContainer component={Paper} sx={{ display: "block", overflowX: "auto" }}>
                <Table sx={{ width: "100%" }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell><b>Code</b></TableCell>
                            <TableCell><b>Name</b></TableCell>
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
                                    <TableCell colSpan={5} sx={{ padding: 0, borderBottom: "none" }}>
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

                                                {/* Skills Display */}
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

                                                {/* Add/Edit Skills Button */}
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<Edit />}
                                                    sx={{ mt: 2 }}
                                                    onClick={() => handleOpenDialog(project)}
                                                >
                                                    Add/Edit Skills
                                                </Button>
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
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>Edit Required Skills</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        {selectedProject?.required_skills.map((skill, index) => (
                            <Chip
                                key={index}
                                label={skill}
                                variant="outlined"
                                onDelete={() => handleRemoveSkill(skill)}
                            />
                        ))}
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <TextField
                            label="Add Skill"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                        />
                        <IconButton color="primary" onClick={handleAddSkill}>
                            <AddCircleOutline />
                        </IconButton>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                    <Button onClick={handleSaveSkills} color="primary" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Projects;