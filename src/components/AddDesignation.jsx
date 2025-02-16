import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, MenuItem, Tooltip, Typography } from '@mui/material';
import { BadgeOutlined, Delete, Domain, Numbers, Person } from '@mui/icons-material';
import { IconClock } from '@tabler/icons-react';
import { toast } from 'react-toastify';

const AddDesignation = ({ isOpen, setIsOpen, triggerRefreshListFlag, isEditMode, designationData, setDesignations }) => {
    const [formData, setFormData] = useState({
        name: '',
        designation_code: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [errors, setErrors] = useState({});


    useEffect(() => {
        setErrors({});
        setIsLoading(false);
        setIsDeleteDialogOpen(false);

        if (isEditMode && designationData) {
            setFormData({
                name: designationData.name || '',
                designation_code: designationData.designation_code || '',
            });
        } else {
            setFormData({
                name: '',
                designation_code: '',
            });
        }
    }, [isEditMode, designationData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
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
        if (!formData.name.trim()) newErrors.name = "Designation Name is required.";
        if (!formData.designation_code.trim()) newErrors.designation_code = "Designation Code is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (isEditMode) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/designations/${designationData.id}`, formData);
                toast.success(`Updated designation: ${formData.name}`);
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/designations/`, formData);
                toast.success(`Added new designation: ${formData.name}`);
            }
            triggerRefreshListFlag();
        } catch (error) {
            toast.error(`Error ${isEditMode ? 'updating' : 'adding'} designation`);
            console.error('Error submitting designation:', error);
        } finally {
            setIsOpen(false);
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/designations/${id}`);
            toast.success("Designation deleted successfully!");
            triggerRefreshListFlag();
        } catch (error) {
            toast.error("Error deleting designation.");
            console.error('Error deleting designation:', error);
        }
        finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth>
            <DialogTitle>{isEditMode ? "Edit Designation" : "New Designation"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Container style={{ paddingTop: "10px" }}>
                        <TextField
                            type="text"
                            name="name"
                            label="Designation Name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Domain />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
                        <Box height={15} />
                        <TextField
                            type="text"
                            name="designation_code"
                            label="Designation Code"
                            value={formData.designation_code}
                            onChange={handleChange}
                            error={!!errors.designation_code}
                            helperText={errors.designation_code}
                            disabled={isLoading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Numbers />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
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
                                            <Typography>Are you sure to delete designation?<br />This cannot be undone.</Typography>
                                            <br />
                                            <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
                                                <Button onClick={() => { setIsDeleteDialogOpen(false); }}>No</Button>
                                                <Button variant='contained' color='error' onClick={() => { handleDelete(designationData.id); }}>Delete</Button>
                                            </Box>
                                        </Box>
                                    } >
                                    <Button color="error" variant='contained' fullWidth onClick={() => { setIsDeleteDialogOpen(true); }} disabled={isLoading}>
                                        <Delete />
                                        <Box width={12} />
                                        Delete Designation
                                    </Button>
                                </Tooltip>
                            </>
                        }
                    </Container>
                </form>
            </DialogContent>
            <DialogActions>

                <Button onClick={() => setIsOpen(false)} disabled={isLoading}>Cancel</Button>
                <Button color="success" onClick={handleSubmit} disabled={isLoading}>
                    {isEditMode ? "Update Designation" : "Add Designation"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDesignation;