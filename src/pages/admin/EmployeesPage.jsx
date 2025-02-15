import React, { useState } from 'react'
import Employees from '../../components/Employees'
import Navbar from '../../components/Navbar'
import { Box, Button, Dialog } from '@mui/material'
import { Add } from '@mui/icons-material'
import AddEmployee from '../../components/AddEmployee'

const EmployeesPage = () => {
    const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Navbar titleText={'Employees'} />
            <Box padding={2}>
                <Button variant='contained' onClick={() => { setIsAddEmployeeOpen(true); }}><Add style={{ marginRight: "10px" }} />Add Employee</Button>
                <AddEmployee isOpen={isAddEmployeeOpen} setIsOpen={setIsAddEmployeeOpen} />
                <Employees />
            </Box>
        </div >
    )
}

export default EmployeesPage