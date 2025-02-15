import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, MenuItem } from '@mui/material';
import { IconClock } from '@tabler/icons-react';
import { AccessTime, Timer, TimerOff, WatchLater, CheckCircleOutline } from '@mui/icons-material';
import { toast } from 'react-toastify';

const AddShift = ({ isOpen, setIsOpen }) => {
    const [formData, setFormData] = useState({
        name: '',
        shift_code: '',
        start_time: '',
        end_time: '',
        break_time: 0,
        total_hours: 0,
        half_day_shift_hours: 0,
        late_coming_mins: 0,
        early_going_mins: 0,
        same_day: 1,
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const numericFields = ["break_time", "total_hours", "half_day_shift_hours", "late_coming_mins", "early_going_mins"];

        let validatedValue = value;

        if (numericFields.includes(name)) {
            validatedValue = value === "" ? 0 : Math.max(0, Number(value));
        } else if (name === "same_day") {
            validatedValue = Number(value);
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: validatedValue
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "Shift Name is required.";
        if (!formData.shift_code) newErrors.shift_code = "Shift Code is required.";
        if (!formData.start_time) newErrors.start_time = "Start Time is required.";
        if (!formData.end_time) newErrors.end_time = "End Time is required.";
        if (formData.break_time < 0) newErrors.half_day_shift_hours = "Break Time minutes must be greater than or equal to 0.";
        if (formData.total_hours <= 0) newErrors.total_hours = "Total Hours must be greater than 0.";
        if (formData.half_day_shift_hours < 0) newErrors.half_day_shift_hours = "Half Day Hours must be greater than or equal to 0.";
        if (formData.late_coming_mins < 0) newErrors.half_day_shift_hours = "Late Coming minutes must be greater than or equal to 0.";
        if (formData.early_going_mins < 0) newErrors.half_day_shift_hours = "Early Going minutes must be greater than or equal to 0.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formattedData = {
            ...formData,
            start_time: formData.start_time + ":00",
            end_time: formData.end_time + ":00"
        };

        setIsLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/shifts/`, formattedData);
            toast.success(`Added a new shift: ${formattedData.name}`);
        } catch (error) {
            toast.error(`Error adding shift: ${error.response?.data?.detail || "Unknown error"}`);
            console.error('Error adding shift:', error);
        } finally {
            setIsOpen(false);
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth>
            <DialogTitle>{"New Shift"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Container display="flex" flexDirection="column" style={{ paddingTop: "10px" }}>
                        <TextField
                            type="text"
                            name="name"
                            label="Shift Name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CheckCircleOutline />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
                        <Box height={15} />
                        <TextField
                            type="text"
                            name="shift_code"
                            label="Shift Code"
                            value={formData.shift_code}
                            onChange={handleChange}
                            error={!!errors.shift_code}
                            helperText={errors.shift_code}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CheckCircleOutline />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
                        <Box height={15} />
                        <TextField
                            type="time"
                            name="start_time"
                            label="Start Time"
                            value={formData.start_time}
                            onChange={handleChange}
                            error={!!errors.start_time}
                            helperText={errors.start_time}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconClock />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
                        <Box height={15} />
                        <TextField
                            type="time"
                            name="end_time"
                            label="End Time"
                            value={formData.end_time}
                            onChange={handleChange}
                            error={!!errors.end_time}
                            helperText={errors.end_time}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconClock />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        />
                        <Box height={15} />
                        {[
                            { name: "break_time", label: "Break Time (mins)", icon: <Timer /> },
                            { name: "total_hours", label: "Total Hours", icon: <AccessTime />, error: errors.total_hours },
                            { name: "half_day_shift_hours", label: "Half Day Hours", icon: <WatchLater />, error: errors.half_day_shift_hours },
                            { name: "late_coming_mins", label: "Late Coming (mins)", icon: <TimerOff /> },
                            { name: "early_going_mins", label: "Early Going (mins)", icon: <TimerOff /> }
                        ].map((field) => (
                            <React.Fragment key={field.name}>
                                <TextField
                                    type="number"
                                    name={field.name}
                                    label={field.label}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    error={!!field.error}
                                    helperText={field.error}
                                    InputProps={{
                                        inputProps: { min: 0, step: "0.01" }, // Ensures positive decimal values
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                {field.icon}
                                            </InputAdornment>
                                        )
                                    }}
                                    fullWidth
                                    required
                                />
                                <Box height={15} />
                            </React.Fragment>
                        ))}
                        <TextField
                            select
                            name="same_day"
                            label="Same Day Shift?"
                            value={formData.same_day}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CheckCircleOutline />
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                            required
                        >
                            <MenuItem value={1}>Yes</MenuItem>
                            <MenuItem value={0}>No</MenuItem>
                        </TextField>
                    </Container>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsOpen(false)} disabled={isLoading}>Cancel</Button>
                <Button color="success" onClick={handleSubmit} disabled={isLoading}>Add Shift</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddShift;