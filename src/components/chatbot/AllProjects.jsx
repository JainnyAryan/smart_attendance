import React from "react";
import {
    Box,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';


const AllProjects = ({ data }) => {
    if (!data || !data.projects || data.projects.length === 0) {
        return null;
    }

    return (
        <Box sx={{ maxHeight: 300, overflowY: "auto", mt: 2 }}>
            <TableContainer component={Paper} sx={{ display: "block", overflowX: "auto" }}>
                <Table sx={{ width: "100%" }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell><b>Code</b></TableCell>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Priority</b></TableCell>
                            <TableCell><b>Status</b></TableCell>
                            <TableCell><b>Start Date</b></TableCell>
                            <TableCell><b>End Date</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.projects.map((project, i) => (
                            <React.Fragment key={project.id}>
                                {/* Collapsible Row */}
                                <TableRow>
                                    <TableCell>{project.code}</TableCell>
                                    <TableCell>{project.name}</TableCell>
                                    <TableCell>{project.priority.toUpperCase()}</TableCell>
                                    <TableCell>{project.status}</TableCell>
                                    <TableCell>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(project.end_date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AllProjects;