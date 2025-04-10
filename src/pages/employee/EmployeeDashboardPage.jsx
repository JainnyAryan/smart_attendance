import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { Box, Button } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import EmployeeDashboard from '../../components/EmployeeDashboard'
import { ArrowForward } from '@mui/icons-material'

const EmployeeDashboardPage = () => {
    const navigate = useNavigate();
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Navbar titleText={'Dashboard'}/>
            <Box padding={2}>
                <EmployeeDashboard />

            </Box>
            <Button variant='outlined'
                sx={{
                    fontSize: "1.2rem", marginTop: "20px",
                    ':hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                    },
                }}
                onClick={() => { navigate('/systemlogs'); }}
            >
                Go to System Log <ArrowForward sx={{ marginLeft: "8px" }} />
            </Button>
        </div>
    )
}

export default EmployeeDashboardPage;