import React, { useEffect, useState } from "react";
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem,
    FormControl, InputLabel, TextField, Chip, Box, Typography
} from "@mui/material";
import { Search } from "@mui/icons-material";
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
    const [searchTerm, setSearchTerm] = useState("");

    const statusOptions = [
        {
            label: "Planned",
            value: "PLANNED"
        },
        {
            label: "In Progress",
            value: "IN_PROGRESS"
        },
        {
            label: "Completed",
            value: "COMPLETED"
        },
        {
            label: "On Hold",
            value: "ON_HOLD"
        }
    ];

    useEffect(() => {
        if (open) {
            setUpdatedProject(project || {});
            fetchMetadata();
            fetchEmployees();
            fetchAssignedEmployees();
        }
    }, [open, project]);

    const fetchMetadata = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/projects-metadata/`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setStatuses(response.data.statuses);
            setPriorities(response.data.priorities);
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
            setAssignedEmployees(response.data.assigned_employees);
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

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredEmployees(
            employees.filter(emp =>
                emp.code.toLowerCase().includes(term) || emp.name.toLowerCase().includes(term)
            )
        );
    };

    const handleAssignEmployee = async (employee) => {
        try {
            await api.post(`${import.meta.env.VITE_BASE_URL}/admin/project-allocations/`, {
                project_id: updatedProject.id,
                employee_id: employee.id,
            }, {
                headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
            });
            setAssignedEmployees((prev) => [...prev, employee]);
        } catch (error) {
            console.error("Error assigning employee:", error);
        }
    };

    const handleRemoveEmployee = async (employeeId) => {
        try {
            await api.delete(`${import.meta.env.VITE_BASE_URL}/admin/project-allocations/${updatedProject.id}/${employeeId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setAssignedEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
        } catch (error) {
            console.error("Error removing employee:", error);
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

                <Box mt={2}>
                    <TextField fullWidth label="Search Employee" onChange={handleSearch} InputProps={{ startAdornment: <Search /> }} />
                    {filteredEmployees.map(emp => (
                        <Chip key={emp.id} label={`${emp.name} (${emp.emp_code})`}
                            onClick={() => handleAssignEmployee(emp)}
                        />
                    ))}
                </Box>

                <Box mt={2}>
                    <Typography variant="body1">Assigned Employees</Typography>
                    {assignedEmployees.map((employee) => (
                        <Chip
                            key={employee.id}
                            label={`${employee.name} (${employee.code})`}
                            onDelete={() => handleRemoveEmployee(employee.id)}
                        />
                    ))}
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