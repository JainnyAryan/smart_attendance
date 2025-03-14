import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import {
    Container,
    Typography,
    Grid,
    CircularProgress,
    Box,
    IconButton,
    Avatar,
    Select,
    MenuItem,
    FormControl,
    LinearProgress,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

dayjs.extend(isoWeek);

const STATUS_COLORS = {
    "Full Day": "#4caf50", // Green
    "Half Day": "orange", // Orange
    Absent: "#f44336", // Red
    "": "#e0e0e000", // Transparent for empty days
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AttendanceCalendar = ({ empId }) => {
    const [calendarData, setCalendarData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const { authToken } = useAuth();

    const months = Array.from({ length: 12 }, (_, i) =>
        dayjs().month(i).format("MMMM")
    );

    const years = Array.from(
        { length: 10 },
        (_, i) => dayjs().year() - 5 + i // 5 years back and 5 years ahead
    );

    useEffect(() => {
        fetchAttendanceData();
    }, [currentMonth]);

    const fetchAttendanceData = async () => {
        setLoading(true);
        try {
            const startDate = currentMonth.startOf("month").format("YYYY-MM-DD");
            const endDate = currentMonth.endOf("month").format("YYYY-MM-DD");

            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/admin/attendance/calendar/`,
                {
                    params: {
                        emp_id: empId,
                        start_date: startDate,
                        end_date: endDate,
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

    const handleMonthChange = (event) => {
        const newMonth = dayjs(currentMonth).month(months.indexOf(event.target.value));
        setCurrentMonth(newMonth);
    };

    const handleYearChange = (event) => {
        const newYear = dayjs(currentMonth).year(event.target.value);
        setCurrentMonth(newYear);
    };

    const handleArrowClick = (direction) => {
        setCurrentMonth((prev) =>
            direction === "prev" ? prev.subtract(1, "month") : prev.add(1, "month")
        );
    };

    const generateCalendar = () => {
        const daysInMonth = currentMonth.daysInMonth();
        const firstDay = currentMonth.startOf("month").day();
        const calendar = [];

        let week = new Array(firstDay).fill(null);

        for (let day = 1; day <= daysInMonth; day++) {
            const date = currentMonth.date(day).format("YYYY-MM-DD");
            week.push({ date, status: calendarData[date] || "" });

            if (week.length === 7) {
                calendar.push(week);
                week = [];
            }
        }

        if (week.length > 0) {
            while (week.length < 7) {
                week.push(null);
            }
            calendar.push(week);
        }

        return calendar;
    };

    const calendar = generateCalendar();

    return (
        <Container maxWidth="lg" style={{ marginTop: "20px" }}>
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={3}>
                <IconButton onClick={() => handleArrowClick("prev")} aria-label="Previous month">
                    <ChevronLeft />
                </IconButton>

                <FormControl>
                    <Select
                        value={currentMonth.format("MMMM")}
                        onChange={handleMonthChange}
                    >
                        {months.map((month) => (
                            <MenuItem key={month} value={month}>
                                {month}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl>
                    <Select
                        value={currentMonth.year()}
                        onChange={handleYearChange}
                    >
                        {years.map((year) => (
                            <MenuItem key={year} value={year}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <IconButton onClick={() => handleArrowClick("next")} aria-label="Next month">
                    <ChevronRight />
                </IconButton>
            </Box>

            {error && (
                <Typography color="error" mb={2}>
                    {error}
                </Typography>
            )}

            <Box mt={3}>
                <Grid container spacing={1}>
                    {DAYS_OF_WEEK.map((day) => (
                        <Grid item xs={1.71} key={day}>
                            <Typography variant="subtitle2" align="center" fontWeight="bold" mb={2}>
                                {day}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                {loading ? <LinearProgress /> : calendar.map((week, weekIndex) => (
                    <Grid container spacing={1} key={weekIndex}>
                        {week.map((day, dayIndex) => (
                            <Grid item xs={1.71} key={dayIndex} sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
                                <Avatar
                                    sx={{
                                        width: { xs: 35, sm: 50, md: 60 },
                                        height: { xs: 35, sm: 50, md: 60 },
                                        backgroundColor: STATUS_COLORS[day?.status || ""],
                                        color: "#fff",
                                    }}
                                >
                                    {day && (
                                        <Typography sx={{ fontSize: { xs: 14, sm: 18, md: 20 } }}>
                                            {dayjs(day.date).date()}
                                        </Typography>
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