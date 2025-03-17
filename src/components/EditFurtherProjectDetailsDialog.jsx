import React, { useEffect, useState } from "react";
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem,
    FormControl, InputLabel, TextField, Chip, Box, Typography, List, ListItem,
    ListItemButton, ListItemText, IconButton,
    Divider
} from "@mui/material";
import { Search, AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const EditFurtherProjectDetailsDialog = ({ open, onClose, project, triggerRefresh }) => {
    const { authToken } = useAuth();
    const [updatedProject, setUpdatedProject] = useState(project || {});
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modifiedAssignments, setModifiedAssignments] = useState(new Set());

    useEffect(() => {
        if (open) {
            setUpdatedProject(project || {});
            fetchMetadata();
            fetchEmployees();
            fetchAssignedEmployees();
            setModifiedAssignments(new Set());
        }
    }, [open, project]);

    const fetchMetadata = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/projects-metadata/`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setStatuses(response.data.statuses);
            setPriorities(response.data.priorities);
            setRoles(response.data.roles);
        } catch (error) {
            console.error("Error fetching project metadata:", error);
        }
    };

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

            // Ensure the data is mapped properly
            const mappedEmployees = response.data.map(emp => ({
                allocation_id: emp.id,
                emp_id: emp.employee.id,
                name: emp.employee.name,
                emp_code: emp.employee.emp_code,
                role: emp.role,
                deadline: emp.deadline,
                allocated_on: emp.allocated_on,
            }));

            setAssignedEmployees(mappedEmployees);
        } catch (error) {
            console.error("Error fetching assigned employees:", error);
        }
    };

    const handleSave = async () => {
        try {
            for (const empStr of modifiedAssignments) {
                const emp = JSON.parse(empStr);

                if (emp.remove) {
                    console.log(emp);
                    await api.delete(
                        `${import.meta.env.VITE_BASE_URL}/admin/project-allocations/${emp.allocation_id}`,
                        { headers: { Authorization: `Bearer ${authToken}` } }
                    );
                } else {
                    await api.post(
                        `${import.meta.env.VITE_BASE_URL}/admin/project-allocations/`,
                        {
                            project_id: updatedProject.id,
                            employee_id: emp.emp_id, // Ensure correct employee ID mapping
                            role: emp.role,
                            deadline: emp.deadline,
                            allocated_on: emp.allocated_on,
                        },
                        { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
                    );
                }
            }

            await api.put(
                `${import.meta.env.VITE_BASE_URL}/admin/projects/${updatedProject.id}`,
                {
                    priority: updatedProject.priority,
                    status: updatedProject.status,
                    required_skills: updatedProject.required_skills,
                },
                { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
            );

            toast.success("Project updated successfully.");
            triggerRefresh();
            onClose();
        } catch (error) {
            toast.error("Failed to update project.");
            console.error("Error updating project:", error.response?.data || error.message);
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

    const handleAddSkill = (skill) => {
        if (skill.trim() && !updatedProject.required_skills.includes(skill.trim())) {
            setUpdatedProject((prev) => ({
                ...prev,
                required_skills: [...prev.required_skills, skill.trim()],
            }));
        }
    };

    const handleRemoveSkill = (skill) => {
        setUpdatedProject((prev) => ({
            ...prev,
            required_skills: prev.required_skills.filter((s) => s !== skill),
        }));
    };

    const handleAssignEmployee = (employee) => {
        const assignedEmployee = {
            emp_id: employee.id,
            name: employee.name,
            emp_code: employee.emp_code,
            role: roles.length ? roles[0] : "",  // Default role
            deadline: updatedProject.end_date,  // Default to project end date
            allocated_on: new Date().toISOString().split('T')[0], // Today's date
        };
        setAssignedEmployees((prev) => [...prev, assignedEmployee]);
        setModifiedAssignments((prev) => {
            const newSet = new Set(prev);
            newSet.add(JSON.stringify(assignedEmployee)); // Store as JSON string to track updates
            return newSet;
        });
    };

    const handleRemoveEmployee = (employeeId) => {
        setAssignedEmployees((prev) => prev.filter((emp) => emp.emp_id !== employeeId));

        setModifiedAssignments((prev) => {
            const newSet = new Set(prev);
            newSet.add(JSON.stringify({ emp_id: employeeId, remove: true })); // Mark for removal
            return newSet;
        });
    };

    const handleRoleChange = (employeeId, newRole) => {
        setAssignedEmployees((prev) =>
            prev.map((emp) => (emp.emp_id === employeeId ? { ...emp, role: newRole } : emp))
        );

        setModifiedAssignments((prev) => {
            const newSet = new Set(prev);
            const emp = assignedEmployees.find((e) => e.emp_id === employeeId);
            newSet.add(JSON.stringify({ ...emp, role: newRole })); // Update modifiedAssignments
            return newSet;
        });
    };

    const handleDeadlineChange = (employeeId, newDeadline) => {
        setAssignedEmployees((prev) =>
            prev.map((emp) => (emp.emp_id === employeeId ? { ...emp, deadline: newDeadline } : emp))
        );

        setModifiedAssignments((prev) => {
            const newSet = new Set(prev);
            const emp = assignedEmployees.find((e) => e.emp_id === employeeId);
            newSet.add(JSON.stringify({ ...emp, deadline: newDeadline })); // Update modifiedAssignments
            return newSet;
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Edit Project Details</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={updatedProject?.status || ""}
                        onChange={(e) => setUpdatedProject({ ...updatedProject, status: e.target.value })}
                    >
                        {statuses.map((status) => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="dense">
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={updatedProject?.priority || ""}
                        onChange={(e) => setUpdatedProject({ ...updatedProject, priority: e.target.value })}
                    >
                        {priorities.map((priority) => (
                            <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box mt={3}>
                    <Typography variant="h6">Required Skills</Typography>
                    {updatedProject.required_skills.map(skill => (
                        <Chip key={skill} sx={{ margin: 0.5 }} label={skill} onDelete={() => handleRemoveSkill(skill)} />
                    ))}
                    <TextField sx={{ marginTop: 1 }} label="Skills (Type and press Enter)" fullWidth
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddSkill(e.target.value);
                                e.target.value = "";
                            }
                        }}
                    />
                </Box>

                <Box mt={4}>
                    <Typography variant="h6">Project Allocation</Typography>
                    <Box mt={1.5} />
                    <TextField fullWidth label="Search Employee" onChange={handleSearch} InputProps={{ startAdornment: <Search /> }} />
                    <List disablePadding>
                        {filteredEmployees.map(emp => (
                            <ListItem key={emp.id} sx={{ border: 1, borderColor: "rgba(0, 0, 0, 0.1)" }} disablePadding>
                                <ListItemButton sx={{ padding: 0, paddingLeft: 2 }}>
                                    <ListItemText primary={emp.name} secondary={emp.emp_code} />
                                    {assignedEmployees.some((e) => e.emp_id === emp.id) ? (
                                        <IconButton onClick={() => handleRemoveEmployee(emp.id)}><RemoveCircleOutline color="error" /></IconButton>
                                    ) : (
                                        <IconButton onClick={() => handleAssignEmployee(emp)}><AddCircleOutline color="primary" /></IconButton>
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box mt={2}>
                    <Typography variant="body1">Assigned Employees</Typography>
                    <Box mt={0.5} />
                    {assignedEmployees.length > 0 ? (
                        <List disablePadding>
                            {assignedEmployees.map((emp, index) => (
                                <ListItem key={emp.emp_id} sx={{ border: 1, borderColor: "rgba(0, 0, 0, 0.1)" }} disablePadding>
                                    <ListItemButton sx={{ paddingRight: 0 }}>
                                        <ListItemText primary={emp.name} secondary={emp.emp_code} />
                                        <Box display={'flex'} flexWrap={'wrap'} justifyContent={'end'}>
                                            <FormControl sx={{ minWidth: 120, marginRight: 1 }}>
                                                <InputLabel>Role</InputLabel>
                                                <Select
                                                    variant="outlined"
                                                    value={emp.role || ""}
                                                    onChange={(e) => {
                                                        const newRole = e.target.value;
                                                        handleRoleChange(emp.emp_id, newRole);
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
                                                value={emp.deadline || ""}
                                                onChange={(e) => {
                                                    const newDeadline = e.target.value;
                                                    handleDeadlineChange(emp.emp_id, newDeadline);
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ width: 150, marginRight: 1 }}
                                            />
                                        </Box>

                                        <IconButton onClick={() => handleRemoveEmployee(emp.emp_id)}>
                                            <RemoveCircleOutline color="error" />
                                        </IconButton>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" sx={{ color: "gray" }}>
                            No employees assigned to this project yet.
                        </Typography>
                    )}
                </Box>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditFurtherProjectDetailsDialog;