import React from "react";
import { useAuth } from "../context/AuthContext";
import { Container, Paper, Typography, Box, Avatar, Grid } from "@mui/material";
import { BadgeOutlined, Domain, Email, Person } from "@mui/icons-material";
import { IconClock } from "@tabler/icons-react";

const EmployeeDashboard = () => {
    const { user } = useAuth();

    if (!user || !user.employee) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    const employee = user.employee;

    return (
        <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                {/* Profile Header */}
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                    <Avatar sx={{ bgcolor: "#3f51b5", width: 64, height: 64 }}>
                        <Person fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            {employee.name}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Employee Code: <b>{employee.emp_code}</b>
                        </Typography>
                    </Box>
                </Box>

                {/* Employee Details Grid */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <InfoCard
                            icon={<Email sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} />}
                            title="Email"
                            value={user.email}
                            bgColor="#4caf50"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoCard
                            icon={<BadgeOutlined sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} />}
                            title="Designation"
                            value={employee.designation?.name || "N/A"}
                            bgColor="#ff9800"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoCard
                            icon={<Domain sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} />}
                            title="Department"
                            value={`${employee.department?.name} (${employee.department?.dept_code})` || "N/A"}
                            bgColor="#f50057"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoCard
                            icon={<IconClock sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} />}
                            title="Shift"
                            value={`${employee.shift?.name} (${employee.shift?.shift_code})` || "N/A"}
                            bgColor="#3f51b5"
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

/**
 * Reusable InfoCard Component for displaying details
 */
const InfoCard = ({ icon, title, value, bgColor }) => {
    return (
        <Paper
            elevation={2}
            sx={{
                padding: { xs: 2, sm: 3, md: 4 },
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: bgColor,
                color: "white",
                borderRadius: 2,
            }}
        >
            <Avatar
                sx={{
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                    width: { xs: 40, sm: 48, md: 56 },
                    height: { xs: 40, sm: 48, md: 56 },
                }}
            >
                {icon}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body1" fontWeight="bold">
                    {title}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
                    }}
                    title={value} // Tooltip on hover
                >
                    {value}
                </Typography>
            </Box>
        </Paper>
    );
};

export default EmployeeDashboard;