import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Stack,
} from '@mui/material';

const statusColorMap = {
  PENDING: 'warning',
  COMPLETED: 'success',
  IN_PROGRESS: 'primary',
  PLANNED: 'secondary',
  ON_HOLD: 'error',
};

const MyProjectAllocations = ({ data }) => {
  const allocations = data?.project_allocations || [];;
  return (
    <Stack spacing={1} maxHeight={500} sx={{ overflowY: 'auto', padding: 2 }}>
      {allocations.map((item) => (
        <Grid item xs={12} md={6} key={item.id}>
          <Card elevation={4}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6" gutterBottom>
                  {item.project.name} ({item.project.code})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.project.description}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap={'wrap'} mt={1}>
                  <Stack direction="row" flexWrap={'wrap'} >
                    <Chip
                      label={`Project: ${item.project.status}`}
                      color={statusColorMap[item.project.status] || 'default'}
                      size="small"
                    />
                    <Chip
                      label={`Contribution: ${item.status}`}
                      color={statusColorMap[item.status] || 'default'}
                      size="small"
                    />
                  </Stack>
                  <Chip
                    label={`Priority: ${item.project.priority}`}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Typography variant="body2">
                  Role: {item.role} | Experience: {item.employee.experience} yrs
                </Typography>

                <Typography variant="body2">
                  Allocated on: {item.allocated_on} | Deadline: {item.deadline}
                </Typography>

                <Typography variant="body2" color="text.secondary" mt={1}>
                  Skills Match:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {item.project.required_skills
                    .filter(skill => item.employee.skills.includes(skill))
                    .map((skill, index) => (
                      <Chip key={index} label={skill} size="small" color="success" />
                    ))}
                  {item.project.required_skills
                    .filter(skill => !item.employee.skills.includes(skill))
                    .map((skill, index) => (
                      <Chip key={index} label={skill} size="small" variant="outlined" />
                    ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Stack>
  );
};

export default MyProjectAllocations;