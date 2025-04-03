import React from "react";
import { Card, Typography, Box } from "@mui/material";

const AttendanceSummary = ({ data }) => {
    if (!data || !data.calendar || data.calendar.length === 0) {
        return <Typography variant="body2">No attendance records found.</Typography>;
    }

    return (
        <Box sx={{ maxHeight: 200, overflowY: "auto", mt: 2 }}>
            {data.calendar.map((entry, i) => (
                <Typography key={i} variant="body2" sx={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{entry.date}</span>
                    <span style={{ fontWeight: "bold", color: entry.status === "Absent" ? "red" : entry.status === "Half Day" ? "orange" : "green" }}>
                        {entry.status}
                    </span>
                </Typography>
            ))}
        </Box>
    );
};

export default AttendanceSummary;