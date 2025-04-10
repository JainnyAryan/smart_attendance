import React from 'react'
import {
    Paper,
    Typography,
    Grid,
    Chip,
    Box,
    Divider,
} from '@mui/material';


const ProjectAllocationSuggestionsChat = ({ data }) => {
    const employees = data?.allocation_suggestions ;
    if (!employees) return null;
    return (
        <div>
            <Box sx={{ my: 1, maxHeight: 300, overflowY: "auto" }}>
                <Paper elevation={3} sx={{ p: 1, bgcolor: '#f5f5f5' }}>
                    <Grid container spacing={1}>
                        {employees.map((emp) => (
                            <Grid item xs={12} key={emp.id}>
                                <Paper variant="outlined" sx={{ p: 1, borderRadius: 2 }}>
                                    <Typography variant="body1" fontWeight={600}>
                                        {emp.name} ({emp.emp_code})
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {emp.email}
                                    </Typography>
                                    <Box >
                                        <Typography variant="body2" color="text.secondary">
                                            Experience: {emp.experience} years
                                        </Typography>
                                        <Box display="flex" flexWrap="wrap" gap={1}>
                                            {emp.skills.map((skill, idx) => (
                                                <Chip key={idx} label={skill} variant="outlined" sx={{ fontSize: 10 }} size="small" />
                                            ))}
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Box>
        </div>
    )
}

export default ProjectAllocationSuggestionsChat