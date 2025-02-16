import React from 'react'
import AdminDashboard from '../../components/AdminDashboard'
import { Box } from '@mui/material'
import Navbar from '../../components/Navbar'

const AdminDashboardPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Navbar titleText={'Dashboard'} />

      {/* <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Button variant="contained" onClick={() => { setEditDepartmentData(null); setIsAddDepartmentOpen(true); }}>
                    <Add sx={{ marginRight: 1 }} /> Add Department
                </Button>
            </Box> */}

      <AdminDashboard />
    </Box>
  )
}

export default AdminDashboardPage