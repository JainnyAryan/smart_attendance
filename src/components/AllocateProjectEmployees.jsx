import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Paper, Select, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { AddCircleOutline, CheckCircleOutline, RemoveCircleOutline, Search, Undo } from '@mui/icons-material';
import { toast } from 'react-toastify';


class AllocationCreate {
    constructor({ project_id, employee, role, deadline, allocated_on }) {
        this.project_id = project_id;
        this.employee = employee;
        this.role = role;
        this.deadline = deadline;
        this.allocated_on = allocated_on || new Date().toISOString().split('T')[0]; // Default to today's date
    }

    toJsonForPost() {
        return {
            project_id: this.project_id,
            employee_id: this.employee.id,
            role: this.role,
            deadline: this.deadline,
            allocated_on: this.allocated_on,
        };
    }
}



const AllocateProjectEmployees = ({ open, onClose, project, triggerRefresh }) => {
    const { authToken } = useAuth();
    const [allocations, setAllocations] = useState([]);
    const [allocationsToBeRemoved, setAllocationsToBeRemoved] = useState([]);
    const [newAllocations, setNewAllocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);


    const fetchEmployees = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/employees/`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setEmployees(response.data);
            setFilteredEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const fetchAssignedEmployees = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/project-allocations/${project.id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setAllocations(response.data);
        } catch (error) {
            console.error("Error fetching assigned employees:", error);
        }
    };

    const fetchMetadata = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/projects-metadata/`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setRoles(response.data.roles);
        } catch (error) {
            console.error("Error fetching project metadata:", error);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredEmployees(
            employees.filter(emp =>
                emp.emp_code.toLowerCase().includes(term) || emp.name.toLowerCase().includes(term)
            )
        );
    };


    const handleAllocateNewEmployee = (employee) => {
        const newAllocation = new AllocationCreate(
            {
                project_id: project.id,
                employee: employee,
                deadline: project.end_date,
                role: roles.length ? roles[0] : ""
            }
        );
        console.log(newAllocation);
        setNewAllocations((prev) => [...prev, newAllocation]);

    }

    const handleRemoveNewAllocation = (value) => {
        const empId = value.employee?.id || value.id;
        setNewAllocations((prev) =>
            prev.filter((item) => item.employee.id !== empId)
        );
    }


    const handleRoleChange = (allocation, newRole) => {
        setNewAllocations((prev) =>
            prev.map((a) => {
                if (a.employee.id === allocation.employee.id) {
                    a.role = newRole;
                }
                return a;
            })
        );
    };

    const handleDeadlineChange = (allocation, newDeadline) => {
        setNewAllocations((prev) =>
            prev.map((a) => {
                if (a.employee.id === allocation.employee.id) {
                    a.deadline = newDeadline;
                }
                return a;
            })
        );
    };

    const handleRemoveAllocation = (allocation) => {
        setAllocationsToBeRemoved((prev) => [...prev, allocation]);
    }

    const handleUndoRemoveAllocation = (allocation) => {
        setAllocationsToBeRemoved((prev) =>
            prev.filter((a) => a.id !== allocation.id)
        );
    }

    const handleSave = async () => {
        try {
            for (const allocationToBeRemoved of allocationsToBeRemoved) {
                await api.delete(
                    `${import.meta.env.VITE_BASE_URL}/admin/project-allocations/${allocationToBeRemoved.id}`,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );
            }
            for (const newAllocation of newAllocations) {
                await api.post(
                    `${import.meta.env.VITE_BASE_URL}/admin/project-allocations/`,
                    newAllocation.toJsonForPost(),
                    { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
                );
            }
            toast.success("Employee allocation changes saved successfully.");
            triggerRefresh();
            onClose();
        } catch (error) {
            toast.error("Failed to save employee allocation changes.");
            console.error("Error saving employee allocation changes:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (open) {
            fetchMetadata();
            fetchEmployees();
            fetchAssignedEmployees();
        }
    }, [open, project]);



    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Project Allocation to Employees</DialogTitle>
            <DialogContent>

                <Box mt={1}>
                    <Box mt={1.5} />
                    <TextField fullWidth label="Search Employee" onChange={handleSearch} InputProps={{ startAdornment: <Search /> }} />
                    <List disablePadding>
                        {filteredEmployees.map(emp => (
                            <ListItem key={emp.id} sx={{ border: 1, borderColor: "rgba(0, 0, 0, 0.1)" }} disablePadding>
                                <ListItemButton sx={{ padding: 0, paddingLeft: 2 }} disableRipple>
                                    <ListItemText primary={emp.name} secondary={emp.emp_code} />
                                    {allocations.some((a) => a.employee.id === emp.id) ?
                                        <IconButton><CheckCircleOutline color="success" /></IconButton>
                                        : newAllocations.some((a) => a.employee.id === emp.id) ?
                                            <IconButton onClick={() => handleRemoveNewAllocation(emp)}><RemoveCircleOutline color="error" /></IconButton>
                                            :
                                            <IconButton onClick={() => handleAllocateNewEmployee(emp)}><AddCircleOutline color="primary" /></IconButton>
                                    }
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box mt={4}>
                    <Typography variant="body1">Employees to be Allocated</Typography>
                    <Box mt={0.5} />
                    {newAllocations.length > 0 ? (
                        <List disablePadding>
                            {newAllocations.map((newAlloc, index) => (
                                <ListItem key={newAlloc.employee.id} sx={{ border: 1, borderColor: "rgba(0, 0, 0, 0.1)" }} disablePadding>
                                    <ListItemButton sx={{ paddingRight: 0 }} disableRipple>
                                        <ListItemText primary={newAlloc.employee.name} secondary={newAlloc.employee.emp_code} />
                                        <Box display={'flex'} flexWrap={'wrap'} justifyContent={'end'}>
                                            <FormControl sx={{ minWidth: 120, marginRight: 1 }}>
                                                <InputLabel>Role</InputLabel>
                                                <Select
                                                    variant="outlined"
                                                    value={newAlloc.role || ""}
                                                    onChange={(e) => {
                                                        const newRole = e.target.value;
                                                        handleRoleChange(newAlloc, newRole);
                                                    }}
                                                >
                                                    {roles.map((role) => (
                                                        <MenuItem key={role} value={role}>
                                                            {role}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <TextField
                                                label="Deadline"
                                                type="date"
                                                variant="filled"
                                                value={newAlloc.deadline || ""}
                                                onChange={(e) => {
                                                    const newDeadline = e.target.value;
                                                    handleDeadlineChange(newAlloc, newDeadline);
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ width: 150, marginRight: 1 }}
                                            />
                                        </Box>

                                        <IconButton onClick={() => handleRemoveNewAllocation(newAlloc)}>
                                            <RemoveCircleOutline color="error" />
                                        </IconButton>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" sx={{ color: "gray" }}>
                            No employees selected right now.
                        </Typography>
                    )}
                </Box>

                <Box mt={4}>
                    <Typography variant="body1">Employees Allocated</Typography>
                    <Box mt={0.5} />
                    {allocations.length > 0 ? (
                        <TableContainer component={Paper} sx={{ display: "block", overflowX: "auto" }}>
                            <Table disablePadding>
                                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell>
                                        <b>Name/Code</b>
                                    </TableCell>
                                    <TableCell>
                                        <b>Role</b>
                                    </TableCell>
                                    <TableCell>
                                        <b>Deadline</b>
                                    </TableCell>
                                    <TableCell>
                                        <b>Remove</b>
                                    </TableCell>
                                </TableHead>
                                {allocations.map((alloc, index) => (
                                    <TableRow>
                                        <TableCell sx={{ opacity: allocationsToBeRemoved.find((a) => a.id === alloc.id) ? 0.5 : 1 }}>
                                            {alloc.employee.name}<br />{alloc.employee.emp_code}
                                        </TableCell>
                                        <TableCell sx={{ opacity: allocationsToBeRemoved.find((a) => a.id === alloc.id) ? 0.5 : 1 }}>
                                            {alloc.role}
                                        </TableCell>
                                        <TableCell sx={{ opacity: allocationsToBeRemoved.find((a) => a.id === alloc.id) ? 0.5 : 1 }}>
                                            {alloc.deadline}
                                        </TableCell>
                                        <TableCell>
                                            <center>
                                                {allocationsToBeRemoved.find((a) => a.id === alloc.id) ? (
                                                    <IconButton onClick={() => handleUndoRemoveAllocation(alloc)}>
                                                        <Undo color="info" />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton onClick={() => handleRemoveAllocation(alloc)}>
                                                        <RemoveCircleOutline color="error" />
                                                    </IconButton>
                                                )}
                                            </center>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="body2" sx={{ color: "gray" }}>
                            No employees allocated to this project yet.
                        </Typography>
                    )}
                </Box>

            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AllocateProjectEmployees


