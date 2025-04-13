import React, { useEffect, useState } from "react";
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem,
    FormControl, InputLabel, TextField, Chip, Box, Typography, List, ListItem,
    ListItemButton, ListItemText, IconButton,
    Divider
} from "@mui/material";
import { Search, AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../utils/api";
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
    const [modifiedAssignments, setModifiedAssignments] = useState(new Set());

    useEffect(() => {
        if (open) {
            setUpdatedProject(project || {});
            fetchMetadata();
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



            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditFurtherProjectDetailsDialog;