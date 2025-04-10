import React from 'react';
import {
    Paper,
    Typography,
    Grid,
    Chip,
    Box,
    Divider,
} from '@mui/material';

const ProjectAllocationsChat = ({ data }) => {
    const allocations = data?.project_allocations;
    if (!allocations) return null;
    return (
        <Box sx={{ my: 1, maxHeight: 300, overflowY: "auto" }}>
            <Paper elevation={3} sx={{ p: 1, borderRadius: 3, bgcolor: '#f5f5f5' }}>
                <Grid container spacing={1}>
                    {allocations.map((alloc) => (
                        <Grid item xs={12} key={alloc.id}>
                            <Paper variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
                                <Typography variant="body1" fontWeight={600}>
                                    {alloc.employee.name} ({alloc.employee.emp_code})
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {alloc.employee.email}
                                </Typography>

                                <Box my={0.5}>
                                    <Chip label={alloc.role} color="primary" size="small" sx={{ mr: 1 }} />
                                    <Chip label={`Status: ${alloc.status}`} color="secondary" size="small" sx={{ mr: 1 }} />
                                    <Chip label={`Allocated: ${alloc.allocated_on}`} size="small" sx={{ mr: 1 }} />
                                    <Chip label={`Deadline: ${alloc.deadline}`} size="small" />
                                </Box>

                                {/* <Divider sx={{ my: 1 }} />

                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2">
                                            <strong>Experience:</strong> {alloc.employee.experience} yrs
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Shift:</strong> {alloc.employee.shift.name} (
                                            {alloc.employee.shift.start_time} - {alloc.employee.shift.end_time})
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Department:</strong> {alloc.employee.department.name}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Designation:</strong> {alloc.employee.designation.name}
                                        </Typography>
                                    </Grid> */}

                                {/* <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Skills:</strong>
                                        </Typography>
                                        <Box display="flex" flexWrap="wrap" gap={1}>
                                            {alloc.employee.skills.map((skill, idx) => (
                                                <Chip key={idx} label={skill} variant="outlined" size="small" />
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid> */}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default ProjectAllocationsChat;