import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, MenuItem, Tooltip, Typography } from '@mui/material';
import { BadgeOutlined, Delete, Domain, Person } from '@mui/icons-material';
import { IconClock } from '@tabler/icons-react';
import { toast } from 'react-toastify';

const AddEmployee = ({ isOpen, setIsOpen, triggerRefreshListFlag, isEditMode, employeeData, setEmployees }) => {
    const [formData, setFormData] = useState({
        name: '',
        shift_id: '',
        dept_id: '',
        designation_id: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [shifts, setShifts] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDropdownData = async () => {
            setIsLoading(true);
            try {
                const [shiftsRes, departmentsRes, designationsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BASE_URL}/admin/shifts/`),
                    axios.get(`${import.meta.env.VITE_BASE_URL}/admin/departments/`),
                    axios.get(`${import.meta.env.VITE_BASE_URL}/admin/designations/`)
                ]);

                setShifts(shiftsRes.data);
                setDepartments(departmentsRes.data);
                setDesignations(designationsRes.data);
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDropdownData();
    }, []);

    useEffect(() => {
        setErrors({});
        setIsLoading(false);
        setIsDeleteDialogOpen(false);

        if (isEditMode && employeeData) {
            setFormData({
                name: employeeData.name || '',
                shift_id: employeeData.shift?.id || '',
                dept_id: employeeData.department?.id || '',
                designation_id: employeeData.designation?.id || ''
            });
        } else {
            setFormData({
                name: '',
                shift_id: '',
                dept_id: '',
                designation_id: ''
            });
        }
    }, [isEditMode, employeeData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: value ? '' : `Please select a ${name.replace('_id', '')}`
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Employee Name is required.";
        if (!formData.shift_id) newErrors.shift_id = "Please select a Shift.";
        if (!formData.dept_id) newErrors.dept_id = "Please select a Department.";
        if (!formData.designation_id) newErrors.designation_id = "Please select a Designation.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (isEditMode) {
                await axios.put(`${import.meta.env.VITE_BASE_URL}/admin/employees/${employeeData.id}`, formData);
                toast.success(`Updated employee: ${formData.name}`);
            } else {
                await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/employees/`, formData);
                toast.success(`Added new employee: ${formData.name}`);
            }
            triggerRefreshListFlag();
            setIsOpen(false);
        } catch (error) {
            toast.error(`Error ${isEditMode ? 'updating' : 'adding'} employee`);
            console.error('Error submitting employee:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (empId) => {
        setIsLoading(true);
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/employees/${empId}`);
            toast.success("Employee deleted successfully!");
            triggerRefreshListFlag();
        } catch (error) {
            toast.error("Error deleting employee.");
            console.error('Error deleting employee:', error);
        }
        finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth>
            <DialogTitle>{isEditMode ? "Edit Employee" : "New Employee"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Container style={{ paddingTop: "10px" }}>
                        <TextField
                            type="text"
                            name="name"
                            label="Employee Name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
                        <Box height={15} />
                        <TextField
                            select
                            name="shift_id"
                            label="Shift"
                            value={formData.shift_id}
                            onChange={handleChange}
                            error={!!errors.shift_id}
                            helperText={errors.shift_id}
                            disabled={isLoading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconClock />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        >
                            <MenuItem value="">Select Shift</MenuItem>
                            {shifts.map((shift) => (
                                <MenuItem key={shift.id} value={shift.id}>
                                    {shift.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box height={15} />
                        <TextField
                            select
                            name="dept_id"
                            label="Department"
                            value={formData.dept_id}
                            onChange={handleChange}
                            error={!!errors.dept_id}
                            helperText={errors.dept_id}
                            disabled={isLoading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Domain />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        >
                            <MenuItem value="">Select Department</MenuItem>
                            {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box height={15} />
                        <TextField
                            select
                            name="designation_id"
                            label="Designation"
                            value={formData.designation_id}
                            onChange={handleChange}
                            error={!!errors.designation_id}
                            helperText={errors.designation_id}
                            disabled={isLoading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BadgeOutlined />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        >
                            <MenuItem value="">Select Designation</MenuItem>
                            {designations.map((designation) => (
                                <MenuItem key={designation.id} value={designation.id}>
                                    {designation.name}
                                </MenuItem>
                            ))}
                        </TextField>
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
                                            <Typography>Are you sure to delete employee?<br />This cannot be undone.</Typography>
                                            <br />
                                            <Box display={'flex'} flexDirection={'row'} justifyContent={'end'}>
                                                <Button onClick={() => { setIsDeleteDialogOpen(false); }}>No</Button>
                                                <Button variant='contained' color='error' onClick={() => { handleDelete(employeeData.id); }}>Delete</Button>
                                            </Box>
                                        </Box>
                                    } >
                                    <Button color="error" variant='contained' fullWidth onClick={() => { setIsDeleteDialogOpen(true); }} disabled={isLoading}>
                                        <Delete />
                                        <Box width={12} />
                                        Delete Employee
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
                    {isEditMode ? "Update Employee" : "Add Employee"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEmployee;