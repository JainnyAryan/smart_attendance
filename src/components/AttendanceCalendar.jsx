// src/components/AttendanceCalendar.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
    Container,
    Typography,
    Grid,
    Paper,
    CircularProgress,
    Box,
    TextField,
    Button,
    Avatar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAuth } from "../context/AuthContext";

dayjs.extend(isoWeek);

const STATUS_COLORS = {
    "Full Day": "#4caf50", // Green
    "Half Day": "orange", // Yellow
    Absent: "#f44336", // Red
    "": "#e0e0e000", // Default grey for days with no data
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AttendanceCalendar = ({ empId }) => {
    const [calendarData, setCalendarData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [startDate, setStartDate] = useState(dayjs().startOf("month"));
    const [endDate, setEndDate] = useState(dayjs().endOf("month"));

    const { authToken } = useAuth();

    useEffect(() => {
        fetchAttendanceData();
    }, []);

    const fetchAttendanceData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/admin/attendance/calendar/`,
                {
                    params: {
                        emp_id: empId,
                        start_date: startDate.format("YYYY-MM-DD"),
                        end_date: endDate.format("YYYY-MM-DD"),
                    },
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );
            setError("");
            const data = response.data.calendar.reduce((acc, day) => {
                acc[day.date] = day.status;
                return acc;
            }, {});
            setCalendarData(data);
        } catch (err) {
            setError("Failed to fetch attendance data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchAttendanceData();
    };

    const generateCalendar = () => {
        const daysInMonth = startDate.daysInMonth();
        const firstDay = startDate.startOf("month").day();
        const calendar = [];

        let week = new Array(firstDay).fill(null); // Fill initial empty days

        for (let day = 1; day <= daysInMonth; day++) {
            const date = startDate.date(day).format("YYYY-MM-DD");
            week.push({ date, status: calendarData[date] || "" });

            if (week.length === 7) {
                calendar.push(week);
                week = [];
            }
        }

        // Push last week if not full
        if (week.length > 0) {
            while (week.length < 7) {
                week.push(null); // Empty days at the end
            }
            calendar.push(week);
        }

        return calendar;
    };

    const calendar = generateCalendar();

    return (
        <Container maxWidth="lg" style={{ marginTop: "20px" }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
                Select date range to view attendance
            </Typography>

            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>
                        <Grid item>
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" type="submit" disabled={loading}>
                                Go
                            </Button>
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </form>

            {error && (
                <Typography color="error" mt={2}>
                    {error}
                </Typography>
            )}


            <Box mt={3}>
                {/* Weekdays header */}
                <Grid container spacing={1}>
                    {DAYS_OF_WEEK.map((day) => (
                        <Grid item xs={1.71} key={day}>
                            <Typography variant="subtitle2" align="center" fontWeight="bold" mb={2}>
                                {day}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* Calendar days */}
                {calendar.map((week, weekIndex) => (
                    <Grid container spacing={1} key={weekIndex}>
                        {week.map((day, dayIndex) => (
                            <Grid item xs={1.71} key={dayIndex} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Avatar
                                    elevation={day?.status ? 3 : 0}
                                    sx={{
                                        width: {
                                            xs: 35,  // 50px for extra small screens (phones)
                                            sm: 50,  // 60px for small screens (tablets)
                                            md: 60,  // 70px for medium screens (laptops)
                                            lg: 70,  // 80px for large screens (desktops)
                                            xl: 80,  // 90px for extra-large screens (big monitors)
                                        },
                                        height: {
                                            xs: 35,
                                            sm: 50,
                                            md: 60,
                                            lg: 70,
                                            xl: 80,
                                        },
                                    }}
                                    style={{
                                        backgroundColor: STATUS_COLORS[day?.status || ""],
                                        textAlign: "center",
                                        color: "#fff",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {day && (
                                        <>
                                            <Typography sx={{ typography: { sm: 'body1', xs: 'body2' } }} display='flex' justifyContent='center' alignItems='center'>
                                                {dayjs(day.date).date()}
                                            </Typography>
                                        </>
                                    )}
                                </Avatar>
                            </Grid>
                        ))}
                    </Grid>
                ))}
            </Box>

        </Container>
    );
};

export default AttendanceCalendar;