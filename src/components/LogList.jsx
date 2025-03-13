import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const LogList = ({ empId, logType }) => {
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const { authToken } = useAuth();

    // Function to get current month's start and end dates
    const getCurrentMonthDates = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .split("T")[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            .toISOString()
            .split("T")[0];
        return { firstDay, lastDay };
    };

    useEffect(() => {
        const { firstDay, lastDay } = getCurrentMonthDates();
        setStartDate(firstDay);
        setEndDate(lastDay);
    }, []);

    const fetchLogs = async () => {
        if (!startDate || !endDate) return;
        setLoading(true);
        try {
            const url = `${import.meta.env.VITE_BASE_URL}/admin/${logType}-logs/employee/${empId}/date-range`;
            const response = await axios.get(url, {
                params: { start_date: startDate, end_date: endDate },
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const data = response.data;
            setLogs(data);
            setTotalPages(Math.ceil(data.length / recordsPerPage));
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [empId, logType, startDate, endDate, recordsPerPage]);

    const handlePageChange = (_, page) => {
        setCurrentPage(page);
    };

    const handleRecordsPerPageChange = (e) => {
        setRecordsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = Array.isArray(logs)
        ? logs.slice(indexOfFirstRecord, indexOfLastRecord)
        : [];

    return (
        <Box sx={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
            <Typography variant="h5" gutterBottom>
                {logType === "system" ? "System Logs" : "Biometric Logs"}
            </Typography>

            {/* Date Filters */}
            <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
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
                <Button variant="contained" onClick={fetchLogs}>
                    Fetch Logs
                </Button>
            </Box>

            {/* Records per page */}
            <FormControl sx={{ minWidth: 120, marginBottom: "20px" }}>
                <InputLabel>Records per page</InputLabel>
                <Select value={recordsPerPage} onChange={handleRecordsPerPageChange}>
                    <MenuItem value={10}>10 per page</MenuItem>
                    <MenuItem value={20}>20 per page</MenuItem>
                    <MenuItem value={50}>50 per page</MenuItem>
                    <MenuItem value={100}>100 per page</MenuItem>
                </Select>
            </FormControl>

            {/* Log Table */}
            {loading ? (
                <CircularProgress />
            ) : currentRecords.length === 0 ? (
                <Typography>No logs found.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Log ID</TableCell>
                                <TableCell>Employee Code</TableCell>
                                <TableCell>{logType == 'system' ? 'Start' : 'In'} Time {logType == 'system' && '/ IP'}</TableCell>
                                <TableCell>{logType == 'system' ? 'End' : 'Out'} Time {logType == 'system' && '/ IP'}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentRecords.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.id}</TableCell>
                                    <TableCell>{log.employee.emp_code}</TableCell>
                                    <TableCell>
                                        {new Date(logType == 'system' ? log.start_time : log.in_time).toLocaleString()}
                                        <br />
                                        {logType == 'system' && '/ IP' && "IP: " + log.in_ip_address}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(logType == 'system' ? log.end_time : log.out_time).toLocaleString()}
                                        <br />
                                        {logType == 'system' && '/ IP' && "IP: " + log.out_ip_address}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Pagination */}
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
            />
        </Box>
    );
};

export default LogList;