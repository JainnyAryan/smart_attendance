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
            setPriorities(response.data.roles);
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
            setAssignedEmployees(response.data);
        } catch (error) {
            console.error("Error fetching assigned employees:", error);
        }
    };

    const handleSave = async () => {
        try {
            for (const empId of modifiedAssignments) {
                const isAssigned = assignedEmployees.some((emp) => emp.id === empId);
                if (isAssigned) {
                    // ✅ Add employee to project
                    await api.post(
                        `${import.meta.env.VITE_BASE_URL}/admin/project-allocations/`,
                        {
                            project_id: updatedProject.id,
                            employee_id: empId,
                            role: "MANAGER",
                        },
                        { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
                    );
                } else {
                    // ❌ Remove employee from project
                    await api.delete(
                        `${import.meta.env.VITE_BASE_URL}/admin/project-allocations/${updatedProject.id}/${empId}`,
                        { headers: { Authorization: `Bearer ${authToken}` } }
                    );
                }
            }

            // ✅ Update project details
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
        setAssignedEmployees((prev) => {
            if (!prev.some((e) => e.id === employee.id)) {
                return [...prev, employee];
            }
            return prev;
        });

        setModifiedAssignments((prev) => new Set(prev).add(employee.id)); // Track the addition
    };

    const handleRemoveEmployee = (employeeId) => {
        setAssignedEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
        setModifiedAssignments((prev) => {
            const updatedSet = new Set(prev);
            updatedSet.add(employeeId);
            return updatedSet;
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
                                    {assignedEmployees.some((e) => e.id === emp.id) ? (
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
                    {assignedEmployees.length > 0 ? <List disablePadding>
                        {assignedEmployees.map(emp => (
                            <ListItem key={emp.id} sx={{ border: 1, borderColor: "rgba(0, 0, 0, 0.1)" }} disablePadding>
                                <ListItemButton sx={{ padding: 0, paddingLeft: 2 }}>
                                    <ListItemText primary={emp.name} secondary={emp.emp_code} />
                                    <IconButton onClick={() => handleRemoveEmployee(emp.id)}><RemoveCircleOutline color="error" /></IconButton>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                        : <Typography variant="body2" sx={{ color: 'gray' }}> No employees assigned to this project yet. </Typography>
                    }
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