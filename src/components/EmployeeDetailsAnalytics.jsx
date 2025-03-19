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
    IconButton,
    FormControl,
    Select,
    MenuItem,
    Chip,
} from "@mui/material";
import {
    BadgeOutlined,
    Domain,
    Email,
    Person,
} from "@mui/icons-material";
import { IconClock } from "@tabler/icons-react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import EmployeeAnalyticsChart from "./EmployeeAnalyticsChart";
import { useAuth } from "../context/AuthContext";
import AttendanceCalendar from "./AttendanceCalendar";
import LogList from "./LogList";
import api from "../api/api";

dayjs.extend(isoWeek);

const EmployeeDetailsAnalytics = ({ employee, printRefs }) => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [startDate, setStartDate] = useState("2025-03-01");
    const [endDate, setEndDate] = useState("2025-03-31");
    const { authToken } = useAuth();

    const { calendarRef, infoRef, analyticsRef, biometricLogsRef, systemLogsRef } = printRefs;
    const months = Array.from({ length: 12 }, (_, i) =>
        dayjs().month(i).format("MMMM")
    );
    const years = Array.from({ length: 10 }, (_, i) => dayjs().year() - 5 + i);
    useEffect(() => {
        updateDateRange();
    }, [selectedMonth]);

    const updateDateRange = () => {
        const start = selectedMonth.startOf("month").format("YYYY-MM-DD");
        const end = selectedMonth.endOf("month").format("YYYY-MM-DD");
        console.log(start);
        console.log(end);
        setStartDate(start);
        setEndDate(end);
    };

    const handleArrowClick = (direction) => {
        setSelectedMonth((prev) =>
            direction === "prev" ? prev.subtract(1, "month") : prev.add(1, "month")
        );
    };

    const handleMonthChange = (value) => {
        const newMonth = dayjs(currentMonth).month(months.indexOf(value));
        setSelectedMonth(newMonth);
    };

    const handleYearChange = (year) => {
        setSelectedMonth(dayjs().year(year));
    };

    useEffect(() => {
        if (employee?.id) {
            fetchAnalytics(employee.id);
        }
    }, [employee, startDate, endDate]);

    const fetchAnalytics = async (empId) => {
        setLoading(true);
        try {
            const { data } = await api.get(
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
                <Box mt={3} />
                <Typography variant="h6">
                    <b>Skills:</b>
                </Typography>
                {employee.skills.map((skill) =>
                    <Chip key={skill} label={skill} variant="outlined" sx={{ margin: 0.5, marginLeft: 0 }} />
                )}
                <Box mt={3} />
                <Typography variant="h6">
                    <b>Experience (in years):</b>
                </Typography>
                <Typography variant="h6">{employee.experience}</Typography>
            </Paper>

            <Box padding={2} />

            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginBottom: 2, overflowY: "auto" }} ref={calendarRef}>
                <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='start'>
                    <Typography variant="h4" fontWeight="bold" mb={3}>
                        Attendance Calendar
                    </Typography>
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="flex-end"
                        gap={0.5}
                    >
                        <Chip size="small" avatar={<Avatar sx={{ bgcolor: "#4caf50" }}>{" "}</Avatar>} label="Full Day" />
                        <Chip size="small" avatar={<Avatar sx={{ bgcolor: "orange" }}>{" "}</Avatar>} label="Half Day" />
                        <Chip size="small" avatar={<Avatar sx={{ bgcolor: "#f44336" }}>{" "}</Avatar>} label="Absent" />
                    </Box>
                </Box>
                <AttendanceCalendar empId={employee.id} />
            </Paper>

            <Box padding={2} />

            {/* GRAPHS */}
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginBottom: 2 }} ref={analyticsRef}>
                <Typography variant="h4" fontWeight="bold" mb={3}>
                    Analytics
                </Typography>

                {/* Date Picker */}
                <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={4}>
                    <IconButton onClick={() => handleArrowClick("prev")} disabled={selectedMonth === 0}>
                        <ChevronLeft />
                    </IconButton>

                    <FormControl>
                        <Select value={selectedMonth.format("MMMM")} onChange={(e) => handleMonthChange((e.target.value))}>
                            {months.map((month, index) => (
                                <MenuItem key={index} value={month}>
                                    {month}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl>
                        <Select value={selectedMonth.year()} onChange={(e) => handleYearChange(e.target.value)}>
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <IconButton onClick={() => handleArrowClick("next")} disabled={selectedMonth === 11}>
                        <ChevronRight />
                    </IconButton>
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