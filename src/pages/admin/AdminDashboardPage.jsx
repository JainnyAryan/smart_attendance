import React from 'react'
import AdminDashboard from '../../components/AdminDashboard'
import { Box } from '@mui/material'
import Navbar from '../../components/Navbar'

const AdminDashboardPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Navbar titleText={'Dashboard'} />
      <AdminDashboard />
    </Box>
  )
}

export default AdminDashboardPage