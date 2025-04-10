import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const LogCard = ({ title, logs, type }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2, maxHeight: 300, overflowY: "auto" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {logs.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No {type} logs for today.
          </Typography>
        ) : (
          logs.map((log, index) => (
            <Box key={index} sx={{ mb: 1, p: 1, borderRadius: 1, background: '#f9f9f9' }}>
              <Typography variant="subtitle2">
                Start/In Time: {new Date(log.start_time || log.in_time).toLocaleString()}
              </Typography>
              {log.end_time && (
                <Typography variant="subtitle2">
                  End/Out Time: {new Date(log.end_time || log.out_time).toLocaleString()}
                </Typography>
              )}
              {log.in_ip_address && (
                <Typography variant="body2" color="text.secondary">
                  IP: {log.in_ip_address}
                </Typography>
              )}
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

const MyAttendanceLogsChat = ({ data }) => {
  const biometricLogs = data.biometric_logs;
  const systemLogs = data.system_logs;
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Today's Attendance Logs
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <LogCard title="System Logs" logs={systemLogs} type="system" />
        </Grid>
        <Grid item xs={12} md={6}>
          <LogCard title="Biometric Logs" logs={biometricLogs} type="biometric" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MyAttendanceLogsChat;