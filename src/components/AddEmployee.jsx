import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, MenuItem, Tooltip, Typography, CircularProgress } from '@mui/material';
import { BadgeOutlined, Delete, Domain, Email, Numbers, Person } from '@mui/icons-material';
import { IconClock } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AddEmployee = ({ isOpen, setIsOpen, triggerRefreshListFlag, isEditMode, employeeData, onCloseEditMode, setEmployees }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        emp_code: '',
        shift_id: '',
        dept_id: '',
        designation_id: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isFetchingEmail, setIsFetchingEmail] = useState(false);
    const [shifts, setShifts] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [errors, setErrors] = useState({});
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchDropdownData = async () => {
            setIsLoading(true);
            try {
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
                email: employeeData.email || '',
                emp_code: employeeData.emp_code || '',
                shift_id: employeeData.shift?.id || '',
                dept_id: employeeData.department?.id || '',
                designation_id: employeeData.designation?.id || ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                emp_code: '',
                shift_id: '',
                dept_id: '',
                designation_id: ''
            });
        }
    }, [isEditMode, employeeData]);

    const [typingTimeout, setTypingTimeout] = useState(null);
    useEffect(() => {
        if (formData.name.length > 2 && !isEditMode) {
            // Clear the previous timeout to reset the debounce timer
            if (typingTimeout) clearTimeout(typingTimeout);

            // Set a new timeout to delay the API call
            const newTimeout = setTimeout(() => {
                setIsFetchingEmail(true);
                api.get(`${import.meta.env.VITE_BASE_URL}/admin/employees/suggest-email-emp-code/${formData.name}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                })
                    .then(response => {
                        setFormData(prev => ({
                            ...prev,
                            email: response.data.suggested_email,
                            emp_code: response.data.suggested_emp_code
                        }));
                    })
                    .catch(error => console.error("Error fetching email suggestion:", error))
                    .finally(() => setIsFetchingEmail(false));
            }, 700);

            setTypingTimeout(newTimeout);
        }

        return () => clearTimeout(typingTimeout); // Cleanup on unmount or re-render
    }, [formData.name]);

    const handleClose = () => {
        setIsOpen(false);
        onCloseEditMode();
        setFormData({
            name: '',
            email: '',
            emp_code: '',
            shift_id: '',
            dept_id: '',
            designation_id: ''
        });
    }

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
        if (!formData.name.trim()) newErrors.name = "Employee Name is required.";
        if (!formData.email.trim()) newErrors.email = "Email id is required.";
        if (!formData.emp_code.trim()) newErrors.email = "Employee Code is required.";
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
                await api.put(`${import.meta.env.VITE_BASE_URL}/admin/employees/${employeeData.id}`, formData, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                toast.success(`Updated employee: ${formData.name}`);
            } else {
                await api.post(`${import.meta.env.VITE_BASE_URL}/admin/employees/`, formData, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                toast.success(`Added new employee: ${formData.name}`);
            }
            triggerRefreshListFlag();
            handleClose();

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
            await api.delete(`${import.meta.env.VITE_BASE_URL}/admin/employees/${empId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            toast.success("Employee deleted successfully!");
            triggerRefreshListFlag();
        } catch (error) {
            toast.error("Error deleting employee.");
            console.error('Error deleting employee:', error);
        }
        finally {
            setIsLoading(false);
            handleClose();
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => handleClose()} fullWidth>
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
                            type="email"
                            name="email"
                            label="Email"
                            placeholder='Start entering name'
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={true}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                ),
                                endAdornment: isFetchingEmail ? <Box><CircularProgress size={20} sx={{ display: "flex" }} /> </Box> : null
                            }}
                            fullWidth
                            required
                        />
                        <Box height={15} />
                        <TextField
                            type="text"
                            name="emp_code"
                            label="Employee Code"
                            placeholder='Start entering name'
                            value={formData.emp_code}
                            onChange={handleChange}
                            error={!!errors.emp_code}
                            helperText={errors.emp_code}
                            disabled={true}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Numbers />
                                    </InputAdornment>
                                ),
                                endAdornment: isFetchingEmail ? <Box><CircularProgress size={20} sx={{ display: "flex" }} /> </Box> : null
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
                                            <Typography>Are you sure to delete employee?<br />All logs of this employee will be permanently deleted.<br />This cannot be undone.</Typography>
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

                <Button onClick={() => handleClose()} disabled={isLoading}>Cancel</Button>
                <Button color="success" onClick={handleSubmit} disabled={isLoading}>
                    {isEditMode ? "Update Employee" : "Add Employee"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEmployee;