import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Box, Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { BadgeOutlined, Domain, People } from '@mui/icons-material';
import { IconClock } from '@tabler/icons-react';
import { AnimatedCounter } from 'react-animated-counter';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    employee_count: 0,
    department_count: 0,
    shift_count: 0,
    designation_count: 0,
  });

  const { authToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/stats/`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const cardData = [
    { title: "Employees", count: stats.employee_count, color: "#3f51b5", icon: <People sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} /> },
    { title: "Departments", count: stats.department_count, color: "#f50057", icon: <Domain sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} /> },
    { title: "Shifts", count: stats.shift_count, color: "#ff9800", icon: <IconClock sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} /> },
    { title: "Designations", count: stats.designation_count, color: "#4caf50", icon: <BadgeOutlined sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} /> },
  ];

  return (
    <Container sx={{ width: "100%", maxWidth: "100dvw", padding: 3 }}>
      <Grid container spacing={2} justifyContent="center">
        {cardData.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 6 }}>
            <Paper
              elevation={4}
              sx={{
                padding: { xs: 4, sm: 3, md: 4 },
                borderRadius: 2,
                backgroundColor: card.color,
                color: "#fff",
              }}
            >
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <Avatar sx={{
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                  width: { xs: 40, sm: 48, md: 56 },
                  height: { xs: 40, sm: 48, md: 56 }
                }}>
                  {card.icon}
                </Avatar>
                <Box textAlign='right'>
                  <Typography variant="h6">{card.title}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1, }}>
                    <AnimatedCounter value={card.count} includeDecimals={false} color="white" fontSize='40px' />
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;