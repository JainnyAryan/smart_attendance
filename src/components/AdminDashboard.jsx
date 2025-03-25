import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Box, ButtonBase, CardActionArea, Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ArrowForward, ArrowOutward, BadgeOutlined, Domain, People, Work } from '@mui/icons-material';
import { IconClock } from '@tabler/icons-react';
import { AnimatedCounter } from 'react-animated-counter';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import TouchRipple from '@mui/material/ButtonBase/TouchRipple';
import { useNavigate } from 'react-router-dom';
import ChatBot from './ChatBot';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    employee_count: 0,
    department_count: 0,
    shift_count: 0,
    designation_count: 0,
    project_count: 0,
  });

  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get(`${import.meta.env.VITE_BASE_URL}/admin/stats/`, {
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
    { title: "Employees", link: "/admin/employees", count: stats.employee_count, color: "#3f51b5", icon: <People sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} /> },
    { title: "Departments", link: "/admin/departments", count: stats.department_count, color: "#f50057", icon: <Domain sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} /> },
    { title: "Shifts", link: "/admin/shifts", count: stats.shift_count, color: "#ff9800", icon: <IconClock sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} /> },
    { title: "Designations", link: "/admin/designations", count: stats.designation_count, color: "#4caf50", icon: <BadgeOutlined sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} /> },
    { title: "Projects", link: "/admin/projects", count: stats.project_count, color: "#795548", icon: <Work sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} /> },
  ];

  return (
    <Container sx={{ width: "100%", maxWidth: "100dvw", padding: 3 }}>
      <Grid container spacing={2} justifyContent="center">
        {cardData.map((card, index) => {
          const isLastItem = index === cardData.length - 1;
          const isOdd = cardData.length % 2 !== 0;
          const gridSize = isLastItem && isOdd ? { xs: 12, sm: 12, md: 12 } : { xs: 12, sm: 6, md: 6 };
          return (
            <Grid key={index} item size={{ ...gridSize }}>
              <CardActionArea sx={{ borderRadius: 2 }} onClick={() => { navigate(card.link); }}>
                <Paper
                  elevation={4}
                  sx={{
                    padding: { xs: 4, sm: 3, md: 4 },
                    borderRadius: 2,
                    backgroundColor: card.color,
                    color: "#fff",
                  }}
                >
                  <Box sx={{ position: "absolute", top: 5, right: 5 }}>
                    <ArrowOutward sx={{ fontSize: 17 }} />
                  </Box>
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
              </CardActionArea>
            </Grid>
          )
        })}
      </Grid>
      <ChatBot/>
    </Container >
  );
};

export default AdminDashboard;