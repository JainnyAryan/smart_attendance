import React from 'react';
import { Box, Typography, Paper, Chip, Stack, Divider } from '@mui/material';
import { motion } from 'framer-motion';

const getColor = (score) => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'warning';
    if (score >= 50) return 'info';
    return 'error';
};

const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
};

const EmployeeScoreBreakdownChat = ({ data }) => {
    const breakdown_data = data?.breakdown_data;
    if (!breakdown_data) return null;

    return (
        <Box p={1} maxHeight={600} sx={{ overflowY: 'auto' }}>
            <Stack spacing={2}>
                {breakdown_data.map((item, index) => {
                    const color = getColor(item.score);
                    const metrics = item.metrics;
                    return (
                        <motion.div
                            key={item.allocation_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Paper elevation={4} sx={{ p: 2, borderRadius: 3 }}>
                                <Stack spacing={1}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        📁 {item.project.name} <Typography variant="caption" color="text.secondary">({item.project.code})</Typography>
                                    </Typography>

                                    <Chip
                                        label={`Score: ${item.score}/100`}
                                        color={color}
                                        sx={{ width: 'fit-content' }}
                                    />

                                    <Divider sx={{ my: 1 }} />

                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        <Chip label={`🕒 Total: ${formatDuration(metrics.total_time)}`} variant="outlined" />
                                        <Chip label={`💼 Active: ${formatDuration(metrics.active_time)}`} variant="outlined" />
                                        <Chip label={`⏸️ On Hold: ${formatDuration(metrics.hold_time)}`} variant="outlined" />
                                        <Chip label={`🔁 Transitions: ${metrics.transitions}`} variant="outlined" />
                                        <Chip
                                            label={metrics.completed_on_time ? '✅ Completed On Time' : '❌ Delayed'}
                                            color={metrics.completed_on_time ? 'success' : 'error'}
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Stack>
                            </Paper>
                        </motion.div>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default EmployeeScoreBreakdownChat;