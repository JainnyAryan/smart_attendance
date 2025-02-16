import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, MenuItem, Tooltip, Typography } from '@mui/material';
import { BadgeOutlined, Delete, Domain, Numbers, Person } from '@mui/icons-material';
import { IconClock } from '@tabler/icons-react';
import { toast } from 'react-toastify';

const AddDepartment = ({ isOpen, setIsOpen, triggerRefreshListFlag, isEditMode, departmentData, setDepartments }) => {
    const [formData, setFormData] = useState({
        name: '',
        dept_code: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [errors, setErrors] = useState({});


    useEffect(() => {
        setErrors({});
        setIsLoading(false);
        setIsDeleteDialogOpen(false);

        if (isEditMode && departmentData) {
            setFormData({
                name: departmentData.name || '',
                dept_code: departmentData.dept_code || '',
            });
        } else {
            setFormData({
                name: '',
                dept_code: '',
            });
        }
    }, [isEditMode, departmentData]);

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
        if (!formData.name.trim()) newErrors.name = "Department Name is required.";
        if (!formData.dept_code.trim()) newErrors.dept_code = "Department Code is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (isEditMode) {
                console.log(formData);
                await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/departments/${departmentData.id}`, formData);
                toast.success(`Updated department: ${formData.name}`);
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/departments/`, formData);
                toast.success(`Added new department: ${formData.name}`);
            }
            triggerRefreshListFlag();
            setIsOpen(false);
        } catch (error) {
            toast.error(`Error ${isEditMode ? 'updating' : 'adding'} department`);
            console.error('Error submitting department:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (empId) => {
        setIsLoading(true);
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/departments/${empId}`);
            toast.success("Department deleted successfully!");
            triggerRefreshListFlag();
        } catch (error) {
            toast.error("Error deleting department.");
            console.error('Error deleting department:', error);
        }
        finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth>
            <DialogTitle>{isEditMode ? "Edit Department" : "New Department"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Container style={{ paddingTop: "10px" }}>
                        <TextField
                            type="text"
                            name="name"
                            label="Department Name"
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
                            name="dept_code"
                            label="Department Code"
                            value={formData.dept_code}
                            onChange={handleChange}
                            error={!!errors.dept_code}
                            helperText={errors.dept_code}
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
                                            <Typography>Are you sure to delete department?<br />This cannot be undone.</Typography>
                                            <br />
                                            <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
                                                <Button onClick={() => { setIsDeleteDialogOpen(false); }}>No</Button>
                                                <Button variant='contained' color='error' onClick={() => { handleDelete(departmentData.id); }}>Delete</Button>
                                            </Box>
                                        </Box>
                                    } >
                                    <Button color="error" variant='contained' fullWidth onClick={() => { setIsDeleteDialogOpen(true); }} disabled={isLoading}>
                                        <Delete />
                                        <Box width={12} />
                                        Delete Department
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
                    {isEditMode ? "Update Department" : "Add Department"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddDepartment;