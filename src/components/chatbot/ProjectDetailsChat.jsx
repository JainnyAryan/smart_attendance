import React from 'react';
import { Paper, Typography, Box, Chip, Stack, Divider } from '@mui/material';

const ProjectDetailsChat = ({ data }) => {
    const project = data?.project;
    if (!project) return null;

    return (
        <Paper elevation={3} sx={{ p: 2, my: 1, maxWidth: 500 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {project.name}
            </Typography>

            <Divider sx={{ mb: 1 }} />

            <Box sx={{ mb: 1 }}>
                <Typography variant="body2"><strong>Code:</strong> {project.code}</Typography>
                <Typography variant="body2"><strong>Priority:</strong> {project.priority}</Typography>
                <Typography variant="body2"><strong>Status:</strong> {project.status}</Typography>
                <Typography variant="body2"><strong>Start Date:</strong> {new Date(project.start_date).toLocaleDateString()}</Typography>
                <Typography variant="body2"><strong>End Date:</strong> {new Date(project.end_date).toLocaleDateString()}</Typography>
                <Typography variant="body2"><strong>Min Experience:</strong> {project.min_experience} years</Typography>
                <Typography variant="body2"><strong>Max Team Size:</strong> {project.max_team_size}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Description:</strong><br /> {project.description}
                </Typography>
            </Box>

            <Typography variant="body2" sx={{ mt: 2, mb: 0 }}><strong>Required Skills:</strong></Typography>
            <Stack direction="row" flexWrap="wrap">
                {project.required_skills.map((skill, index) => (
                    <Chip key={index} label={skill} sx={{ margin: 0.5 }} size="small" />
                ))}
            </Stack>
        </Paper>
    );
};

export default ProjectDetailsChat;