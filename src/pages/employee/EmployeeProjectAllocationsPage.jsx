import React from 'react'
import EmployeeProjectAllocations from '../../components/EmployeeProjectAllocations'
import Navbar from '../../components/Navbar'
import { Box } from '@mui/material'

const EmployeeProjectAllocationsPage = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <Navbar titleText={'My Project Allocations'} />
            <EmployeeProjectAllocations />
        </div>
    )
}

export default EmployeeProjectAllocationsPage