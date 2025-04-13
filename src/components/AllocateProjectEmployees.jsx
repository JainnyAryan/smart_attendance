import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemText, MenuItem, Paper, Select, Stack, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { AddCircleOutline, CheckCircle, RemoveCircleOutline, Search, Undo } from '@mui/icons-material';
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
    const [employees, setEmployees] = useState([]);
    const [employeeScores, setEmployeeScores] = useState([]);
    const [suggestedEmployees, setSuggestedEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [filters, setFilters] = useState({
        search_query: '',
        shift_id: '',
        department_id: '',
        designation_id: '',
        skillFilters: [],
    });
    const [skillFilters, setSkillFilters] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [roles, setRoles] = useState([]);


    const fetchEmployees = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/employees/`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const employeesData = response.data;
            const mergedEmployees = await fetchEmployeeScores(employeesData);
            mergedEmployees.sort((a, b) => b.score - a.score);
            setEmployees(mergedEmployees);
            setFilteredEmployees(mergedEmployees);
            await fetchSuggestedEmployees(mergedEmployees);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const fetchEmployeeScores = async (employeesData) => {
        if (!employeesData.length) return [];
        try {
            const response = await api.get(`${import.meta.env.VITE_BASE_URL}/performance/admin/employee-performance-scores/`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const employeeScores = response.data;
            const mergedEmployees = employeesData.map(emp => {
                console.log(emp.id);
                const scoreObj = employeeScores.find(sc => sc.employee_id === String(emp.id));
                console.log(scoreObj);
                return {
                    ...emp,
                    score: scoreObj ? scoreObj.score : 0,
                };
            });
            return mergedEmployees;
        } catch (error) {
            console.error("Error fetching employee scores:", error);
        }
    };

    const fetchSuggestedEmployees = async (employees) => {
        try {
            const response = await api.get(
                `${import.meta.env.VITE_BASE_URL}/admin/project-allocations/${project.id}/suggested-employees/`,
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );
            const suggestedEmployeesIds = response.data;
            const suggestedEmployeesList = employees
                .filter(emp => suggestedEmployeesIds.includes(emp.id))
                .sort((a, b) => suggestedEmployeesIds.indexOf(a.id) - suggestedEmployeesIds.indexOf(b.id)); // Preserve order
            setSuggestedEmployees(suggestedEmployeesList);
        } catch (error) {
            console.error("Error fetching suggested employees:", error);
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
            setRoles(response.data.roles);
        } catch (error) {
            console.error("Error fetching project metadata:", error);
        }
    };

    const filterEmployees = (name, value) => {
        const updatedFilters = { ...filters, [name]: value };
        setFilters(updatedFilters);

        const filtered = employees.filter(employee => {
            const search_query = updatedFilters.search_query.trim().toLowerCase();
            const hasMatchingSkills =
                skillFilters.length === 0 || skillFilters.every(skill => employee.skills?.includes(skill));

            return (
                (search_query === '' ||
                    employee.name.toLowerCase().includes(search_query) ||
                    employee.email.toLowerCase().includes(search_query) ||
                    employee.emp_code.toLowerCase().includes(search_query)) &&
                (updatedFilters.shift_id === '' || employee.shift?.id === updatedFilters.shift_id) &&
                (updatedFilters.department_id === '' || employee.department?.id === updatedFilters.department_id) &&
                (updatedFilters.designation_id === '' || employee.designation?.id === updatedFilters.designation_id) &&
                hasMatchingSkills
            );
        });

        setFilteredEmployees(filtered);
    };

    const addSkillFilter = (skill) => {
        setSkillFilters((prevFilters) =>
            prevFilters.includes(skill) ? prevFilters : [...prevFilters, skill]
        );
    };

    const removeSkillFilter = (skill) => {
        setSkillFilters((prevFilters) => prevFilters.filter(s => s !== skill));
    };

    useEffect(() => {
        filterEmployees("skillFilters", skillFilters);
    }, [skillFilters]);

    const handleAllocateNewEmployee = (employee) => {
        var oldNewAllocationsSize = allocations.length + newAllocations.length;
        var remainingAllocations = project.max_team_size - oldNewAllocationsSize;
        if (remainingAllocations <= 0) {
            toast.warning(`Already maximum employees allocated to this project.\n
                Maximum team size for this project is ${project.max_team_size}.`);
            return;
        }
        const newAllocation = new AllocationCreate(
            {
                project_id: project.id,
                employee: employee,
                deadline: project.end_date,
                role: roles.length ? roles[0] : ""
            }
        );
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
        <Dialog open={open} onClose={onClose} maxWidth={'xl'} fullWidth>
            <DialogTitle>Project Allocation to Employees</DialogTitle>
            <DialogContent>
                <Box mt={1.5} />
                <Typography variant="body1"><b>Suggested Employees</b>  ({suggestedEmployees.length})</Typography>
                <Box mt={1.5} />
                <List sx={{ maxHeight: "40dvh", overflowY: "auto", overflowX: "auto" }} disablePadding>
                    {suggestedEmployees.map(emp => (
                        <ListItem key={emp.id} sx={{ border: 1, borderColor: "rgba(0, 0, 0, 0.1)" }} disablePadding>
                            <ListItemButton sx={{ padding: 0, paddingLeft: 2, display: "flex", justifyContent: "space-between" }} disableRipple>
                                <Stack direction={'column'}>
                                    <ListItemText primary={emp.name} secondary={`${emp.emp_code} | Score: ${emp.score}`} />
                                    <ListItemText secondary={`Experience: ${emp.experience} yrs`} />
                                    <Box>
                                        {emp.skills.map((skill) =>
                                            <Chip label={skill} variant={project.required_skills.some(s => s === skill) ? 'filled' : 'outlined'} color='success' sx={{ fontSize: 12, padding: 0, height: 18, marginBottom: 0.5, marginRight: 0.5 }} />
                                        )}
                                    </Box>
                                </Stack>
                                {allocations.some((a) => a.employee.id === emp.id) ?
                                    <IconButton><CheckCircle color="success" /></IconButton>
                                    : newAllocations.some((a) => a.employee.id === emp.id) ?
                                        <IconButton onClick={() => handleRemoveNewAllocation(emp)}><RemoveCircleOutline color="error" /></IconButton>
                                        :
                                        <IconButton onClick={() => handleAllocateNewEmployee(emp)}><AddCircleOutline color="primary" /></IconButton>
                                }
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Box mt={4} >
                    <Typography variant="body1"><b>All Employees</b></Typography>
                    <Box mt={1.5} />
                    <TextField label="Search by name/code/email"
                        value={filters.search_query}
                        onChange={(e) => filterEmployees('search_query', e.target.value)}
                        fullWidth
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />
                    <Box mt={2} />
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 2 }}>
                        <Select
                            displayEmpty
                            value={filters.shift_id}
                            onChange={(e) => filterEmployees("shift_id", e.target.value)}
                        >
                            <MenuItem value="">All Shifts</MenuItem>
                            {shifts.map((shift) => (
                                <MenuItem key={shift.id} value={shift.id}>{shift.name}</MenuItem>
                            ))}
                        </Select>
                        <Select
                            displayEmpty
                            value={filters.department_id}
                            onChange={(e) => filterEmployees("department_id", e.target.value)}
                        >
                            <MenuItem value="">All Departments</MenuItem>
                            {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                            ))}
                        </Select>
                        <Select
                            displayEmpty
                            value={filters.designation_id}
                            onChange={(e) => filterEmployees("designation_id", e.target.value)}
                        >
                            <MenuItem value="">All Designations</MenuItem>
                            {designations.map((desig) => (
                                <MenuItem key={desig.id} value={desig.id}>{desig.name}</MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box mt={2} />

                    <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'}>
                        <TextField
                            sx={{ marginTop: 1, width: { xs: "80dvw", sm: "50dvw", md: "40dvw", lg: "40dvw", xl: "40dvw" } }}
                            label="Skills Filter (Type and press Enter)"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addSkillFilter(e.target.value);
                                    e.target.value = "";
                                }
                            }}
                        />
                        {skillFilters.length > 0 ? skillFilters.map((skill) =>
                            <Chip key={skill} sx={{ margin: 0.5 }} label={skill} onDelete={() => removeSkillFilter(skill)} />
                        ) :
                            <Typography variant="body1" sx={{ color: "gray", margin: 2 }}>
                                No skill filters.
                            </Typography>
                        }
                    </Box>

                    <Box mt={2} />

                    <List sx={{ maxHeight: "40dvh", overflowY: "auto", overflowX: "auto" }} disablePadding>
                        {filteredEmployees.map(emp => (
                            <ListItem key={emp.id} sx={{ border: 1, borderColor: "rgba(0, 0, 0, 0.1)" }} disablePadding>
                                <ListItemButton sx={{ padding: 0, paddingLeft: 2, display: "flex", justifyContent: "space-between" }} disableRipple>
                                    <Stack direction={'column'}>
                                        <ListItemText primary={emp.name} secondary={emp.emp_code} />
                                        <Box>
                                            {emp.skills.map((skill) =>
                                                <Chip label={skill} variant={skillFilters.includes(skill) ? 'filled' : 'outlined'} sx={{ fontSize: 12, padding: 0, height: 18, marginBottom: 0.5, marginRight: 0.5 }} />
                                            )}
                                        </Box>
                                    </Stack>
                                    {allocations.some((a) => a.employee.id === emp.id) ?
                                        <IconButton><CheckCircle color="success" /></IconButton>
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
                    <Typography variant="body1"><b>Employees to be Allocated</b> ({newAllocations.length})</Typography>
                    <Box mt={0.5} />
                    {newAllocations.length > 0 ? (
                        <List sx={{ maxHeight: "40dvh", overflowY: "auto", overflowX: "auto" }} disablePadding>
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
                    <Typography variant="body1"><b>Employees Allocated</b> ({allocations.length})</Typography>
                    <Box mt={0.5} />
                    {allocations.length > 0 ? (
                        <TableContainer component={Paper} sx={{ display: "block", maxHeight: "40dvh", overflowY: "auto", overflowX: "auto" }}>
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
                                        <center>
                                            <b>Remove ({allocationsToBeRemoved.length})</b>
                                        </center>
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


