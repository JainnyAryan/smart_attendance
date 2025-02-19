import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import EmployeeDashboard from '../../components/EmployeeDashboard'

const EmployeeDashboardPage = () => {


    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Navbar />
            <Box padding={2}>
                <EmployeeDashboard />
            </Box>
        </div>
    )
}

export default EmployeeDashboardPage;