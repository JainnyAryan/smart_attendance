import React from 'react'
import Navbar from '../../components/Navbar';
import { Box } from '@mui/material';
import EmployeeSystemLog from '../../components/EmployeeSystemLog';

const EmployeeSystemLogPage = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Navbar titleText={'System Log'} />
            <Box padding={2}>
                <EmployeeSystemLog />
            </Box>
        </div>
    )
}

export default EmployeeSystemLogPage;