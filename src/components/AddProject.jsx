import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    InputAdornment,
    Typography,
    CircularProgress,
    Tooltip
} from '@mui/material';
import { CalendarMonth, Code, Delete, Description, Group, Label, Star } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const AddProject = ({ isOpen, setIsOpen, triggerRefreshListFlag, isEditMode, projectData, onCloseEditMode }) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        max_team_size: '',
        min_experience: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const { authToken } = useAuth();

    useEffect(() => {
        setErrors({});
        setIsLoading(false);

        if (isEditMode && projectData) {
            setFormData({
                code: projectData.code || '',
                name: projectData.name || '',
                description: projectData.description || '',
                start_date: projectData.start_date || '',
                end_date: projectData.end_date || '',
                max_team_size: projectData.max_team_size || '',
                min_experience: projectData.min_experience || ''
            });
        } else {
            setFormData({
                code: '',
                name: '',
                description: '',
                start_date: '',
                end_date: '',
                max_team_size: '',
                min_experience: ''
            });
        }
    }, [isEditMode, projectData]);

    const handleClose = () => {
        onCloseEditMode();
        setIsOpen(false);
        setFormData({
            code: '',
            name: '',
            description: '',
            start_date: '',
            end_date: '',
            max_team_size: '',
            min_experience: ''
        });
    };

    const handleChange = (e) => {
        var { name, value } = e.target;
        if (name === 'max_team_size' || name === 'min_experience') {
            if (isNaN(value)) return;
            value = Number(value);
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.code.trim()) newErrors.code = "Project Code is required.";
        if (!formData.name.trim()) newErrors.name = "Project Name is required.";
        if (!formData.description.trim()) newErrors.description = "Description is required.";
        if (!formData.start_date) newErrors.start_date = "Start Date is required.";
        if (!formData.end_date) newErrors.end_date = "End Date is required.";
        if (!formData.max_team_size || isNaN(formData.max_team_size)) newErrors.max_team_size = "Valid Max Team Size is required.";
        if (!formData.min_experience || isNaN(formData.min_experience)) newErrors.min_experience = "Valid Min Experience is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (isEditMode) {
                await api.put(`${import.meta.env.VITE_BASE_URL}/admin/projects/${projectData.id}`, formData, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                toast.success(`Updated project: ${formData.name}`);
            } else {
                await api.post(`${import.meta.env.VITE_BASE_URL}/admin/projects/`, formData, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                toast.success(`Added new project: ${formData.name}`);
            }
            triggerRefreshListFlag();
            handleClose();
        } catch (error) {
            toast.error(`Error ${isEditMode ? 'updating' : 'adding'} project`);
            console.error('Error submitting project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            await api.delete(`${import.meta.env.VITE_BASE_URL}/admin/projects/${id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            toast.success("Project deleted successfully!");
            triggerRefreshListFlag();
        } catch (error) {
            toast.error("Error deleting project.");
            console.error('Error deleting project:', error);
        }
        finally {
            setIsDeleteDialogOpen(false);
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth>
            <DialogTitle>{isEditMode ? "Edit Project" : "New Project"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Container style={{ paddingTop: "10px" }}>
                        <TextField
                            type="text"
                            name="code"
                            label="Project Code"
                            value={formData.code}
                            onChange={handleChange}
                            error={!!errors.code}
                            helperText={errors.code}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Code />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
                        <Box height={15} />
                        <TextField
                            type="text"
                            name="name"
                            label="Project Name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Label />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
                        <Box height={15} />
                        <TextField
                            type="text"
                            name="description"
                            label="Description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            error={!!errors.description}
                            helperText={errors.description}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Description />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
                        <Box height={15} />
                        <TextField
                            type="date"
                            name="start_date"
                            label="Start Date"
                            value={formData.start_date}
                            onChange={handleChange}
                            error={!!errors.start_date}
                            helperText={errors.start_date}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarMonth />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <Box height={15} />
                        <TextField
                            type="date"
                            name="end_date"
                            label="End Date"
                            value={formData.end_date}
                            onChange={handleChange}
                            error={!!errors.end_date}
                            helperText={errors.end_date}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarMonth />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <Box height={15} />
                        <TextField
                            type="number"
                            name="max_team_size"
                            label="Max Team Size"
                            value={formData.max_team_size}
                            onChange={handleChange}
                            error={!!errors.max_team_size}
                            helperText={errors.max_team_size}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Group />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
                        <Box height={15} />
                        <TextField
                            type="text"
                            name="required_skills"
                            label="Required Skills (can be set later)"
                            fullWidth
                            disabled
                        />
                        <Box height={15} />
                        <TextField
                            type="number"
                            name="min_experience"
                            label="Min Experience (years)"
                            value={formData.min_experience}
                            onChange={handleChange}
                            error={!!errors.min_experience}
                            helperText={errors.min_experience}
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === '.') e.preventDefault();
                            }}
                            InputProps={{
                                inputProps: { min: 0, step: "1" },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Star />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
                    </Container>
                </form>
                {isEditMode &&
                    <>
                        <Box height={15} />
                        <Tooltip arrow open={isDeleteDialogOpen}
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        bgcolor: 'white',
                                        color: 'black',
                                        border: "1px solid grey",
                                    },
                                },
                            }}
                            title={
                                <Box>
                                    <Typography>Are you sure to delete thr project?<br />This cannot be undone.</Typography>
                                    <br />
                                    <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
                                        <Button onClick={() => { setIsDeleteDialogOpen(false); }}>No</Button>
                                        <Button variant='contained' color='error' onClick={() => { handleDelete(projectData.id); }}>Delete</Button>
                                    </Box>
                                </Box>
                            } >
                            <Button color="error" variant='contained' fullWidth onClick={() => { setIsDeleteDialogOpen(true); }} disabled={isLoading}>
                                <Delete />
                                <Box width={12} />
                                Delete Project
                            </Button>
                        </Tooltip>
                    </>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>Cancel</Button>
                <Button color="success" onClick={handleSubmit} disabled={isLoading}>
                    {isEditMode ? "Update Project" : "Add Project"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProject;