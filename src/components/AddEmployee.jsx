import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, MenuItem } from '@mui/material';
import { BadgeOutlined, Domain, Person } from '@mui/icons-material';
import { IconClock } from '@tabler/icons-react';
import { toast } from 'react-toastify';

const AddEmployee = ({ isOpen, setIsOpen }) => {
    const [formData, setFormData] = useState({
        name: '',
        shift_id: 'Select Shift',
        dept_id: 'Select Department',
        designation_id: 'Select Designation'
    });

    const [shifts, setShifts] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

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
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchDropdownData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        

        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/employees/`, formData);
            toast.success(`Successfully added employee: ${formData.name}`);
        } catch (error) {
            toast.error(`Error adding employee: ${error.response?.data?.detail || "Unknown error"}`);
            console.error('Error adding employee:', error);
        } finally {
            setIsOpen(false);
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth>
            <DialogTitle>{"New Employee Details"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Container display="flex" flexDirection="column" justifyContent="space-between" style={{ paddingTop: "10px" }}>
                        <TextField
                            type="text"
                            name="name"
                            label="Employee Name"
                            value={formData.name}
                            onChange={handleChange}
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
                            {designations.map((designation) => (
                                <MenuItem key={designation.id} value={designation.id}>
                                    {designation.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Container>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsOpen(false)} disabled={isLoading}>
                    Cancel
                </Button>
                <Button color="success" onClick={handleSubmit} disabled={isLoading}>
                    Add Employee
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEmployee;