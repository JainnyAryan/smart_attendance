import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

const DashboardPage = () => {


    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Navbar />
            <Box padding={2}>
                DASHBOARD
            </Box>
        </div>
    )
}

export default DashboardPage;