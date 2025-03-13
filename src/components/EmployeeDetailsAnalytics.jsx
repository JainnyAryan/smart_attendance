import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Grid,
    CircularProgress,
    TextField,
    Button,
} from "@mui/material";
import {
    BadgeOutlined,
    Domain,
    Email,
    Person,
} from "@mui/icons-material";
import { IconClock } from "@tabler/icons-react";
import { Bar, Line } from "react-chartjs-2";
import EmployeeAnalyticsChart from "./EmployeeAnalyticsChart";
import { useAuth } from "../context/AuthContext";
import AttendanceCalendar from "./AttendanceCalendar";
import LogList from "./LogList";

const EmployeeDetailsAnalytics = ({ employee, printRefs }) => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("2025-03-01");
    const [endDate, setEndDate] = useState("2025-03-31");
    const { authToken } = useAuth();

    const { calendarRef, infoRef, analyticsRef, biometricLogsRef, systemLogsRef } = printRefs;

    useEffect(() => {
        if (employee?.id) {
            fetchAnalytics(employee.id);
        }
    }, [employee]);

    const fetchAnalytics = async (empId) => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/admin/analytics/${empId}?start_date=${startDate}&end_date=${endDate}`,
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );
            setAnalyticsData(data.time_wastage_data);
        } catch (error) {
            console.error("Error fetching analytics data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!employee) {
        return <Typography variant="h6">Loading Employee Info...</Typography>;
    }

    const { name, email, emp_code, department, designation, shift } = employee;

    const dates = analyticsData?.map((log) => log.date);
    const bioDurations = analyticsData?.map((log) =>
        parseFloat((log.bio_duration / 3600).toFixed(2))
    );
    const sysDurations = analyticsData?.map((log) =>
        parseFloat((log.sys_duration / 3600).toFixed(2))
    );
    const wastedTime = analyticsData?.map((log) =>
        parseFloat((log.wasted_time / 60).toFixed(2))
    );

    const timeComparisonData = {
        labels: dates,
        datasets: [
            {
                label: "Biometric Hours",
                data: bioDurations,
                backgroundColor: "#4caf50",
            },
            {
                label: "System Log Hours",
                data: sysDurations,
                backgroundColor: "#ff9800",
            },
        ],
    };

    const timeWastageData = {
        labels: dates,
        datasets: [
            {
                label: "Time Wasted (mins)",
                data: wastedTime,
                borderColor: "#f50057",
                backgroundColor: "rgba(245, 0, 87, 0.2)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }} ref={infoRef}>
                {/* Profile Header */}
                <Box display="flex" alignItems="center" gap={2} mb={4}>
                    <Avatar sx={{ bgcolor: "#3f51b5", width: 64, height: 64 }}>
                        <Person fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            {name || "N/A"}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Employee Code: <b>{emp_code || "N/A"}</b>
                        </Typography>
                    </Box>
                </Box>

                {/* Employee Details */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <InfoCard icon={<Email />} title="Email" value={email} bgColor="#4caf50" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoCard
                            icon={<Domain />}
                            title="Department"
                            value={`${department?.name} (${department?.dept_code})`}
                            bgColor="#f50057"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoCard
                            icon={<BadgeOutlined />}
                            title="Designation"
                            value={designation?.name}
                            bgColor="#ff9800"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoCard
                            icon={<IconClock />}
                            title="Shift"
                            value={`${shift?.start_time} - ${shift?.end_time}`}
                            bgColor="#3f51b5"
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Box padding={2} />
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginBottom: 2 }} ref={calendarRef}>
                {/* Date Picker */}
                <Typography variant="h4" fontWeight="bold" mb={3}>
                    Attendance Calendar
                </Typography>
                <AttendanceCalendar empId={employee.id} />
            </Paper>
            <Box padding={2} />
            {/* GRAPHS */}
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginBottom: 2 }} ref={analyticsRef}>
                {/* Date Picker */}
                <Typography variant="h4" fontWeight="bold" mb={3}>
                    Analytics
                </Typography>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                    Select date range to view analytics
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={4}>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => fetchAnalytics(employee.id)}
                        disabled={loading}
                    >
                        Go
                    </Button>
                </Box>

                {/* Analytics Cards */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                            <Typography variant="h5" mb={2}>
                                Biometric vs System Log Hours
                            </Typography>

                            <div style={{ height: "400px" }}>
                                <EmployeeAnalyticsChart data={timeComparisonData} type="bar" />
                            </div>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                            <Typography variant="h5" mb={2}>
                                Time Wastage Analysis
                            </Typography>

                            <div style={{ height: "400px" }}>
                                <EmployeeAnalyticsChart data={timeWastageData} type="line" />
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
            <Box padding={2} />
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginBottom: 2 }} ref={biometricLogsRef}>
                <LogList empId={employee.id} logType='biometric' />
            </Paper>
            <Box padding={2} />
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginBottom: 2 }} ref={systemLogsRef}>
                <LogList empId={employee.id} logType='system' />
            </Paper>
        </Container>
    );
};

const InfoCard = ({ icon, title, value, bgColor }) => {
    return (
        <Paper
            elevation={2}
            sx={{
                padding: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: bgColor,
                color: "white",
                borderRadius: 2,
            }}
        >
            <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.3)", width: 48, height: 48 }}>
                {icon}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="h6">{value || "N/A"}</Typography>
            </Box>
        </Paper>
    );
};

export default EmployeeDetailsAnalytics;