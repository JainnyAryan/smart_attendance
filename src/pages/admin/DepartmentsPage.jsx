import React, { useState } from 'react'
import Employees from '../../components/Employees'
import Navbar from '../../components/Navbar'
import { Box, Button } from '@mui/material'
import Departments from '../../components/Departments'
import { Add } from '@mui/icons-material'
import AddDepartment from '../../components/AddDepartment'

const DepartmentsPage = () => {
    const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Navbar titleText={'Departments'} />
            <Box padding={2}>
                <Button variant='contained' onClick={() => { setIsAddDepartmentOpen(true); }}><Add style={{ marginRight: "10px" }} />Add Departments</Button>
                <AddDepartment isOpen={isAddDepartmentOpen} setIsOpen={setIsAddDepartmentOpen} />
                <Departments />
            </Box>
        </div>
    )
}

export default DepartmentsPage