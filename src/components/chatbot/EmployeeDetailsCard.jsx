import React from "react";
import { Card, Typography, Box, Avatar } from "@mui/material";

const EmployeeDetailsCard = ({ data }) => {
    const employee = data?.employee;
    if (!employee) return null;

    return (
        <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: "#1976d2" }}>
                {employee.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
                <Typography variant="h6">{employee.name}</Typography>
                <Typography variant="body1">
                    {employee.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Code: {employee.emp_code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Department: {employee.department.dept_code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Designation: {employee.designation.designation_code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Shift: {employee.shift.shift_code}
                </Typography>
            </Box>
        </Box>
    );
};

export default EmployeeDetailsCard;