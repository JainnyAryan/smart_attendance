import React, { useState } from 'react'
import Employees from '../../components/Employees'
import Navbar from '../../components/Navbar'
import { Box, Button } from '@mui/material'
import Designations from '../../components/Designations'
import { Add } from '@mui/icons-material'
import AddDesignation from '../../components/AddDesignation'

const DesignationsPage = () => {
    const [isAddDesignationOpen, setIsAddDesignationOpen] = useState(false);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Navbar titleText={'Designations'} />
            <Box padding={2}>
                <Button variant='contained' onClick={() => { setIsAddDesignationOpen(true); }}><Add style={{ marginRight: "10px" }} />Add Designations</Button>
                <AddDesignation isOpen={isAddDesignationOpen} setIsOpen={setIsAddDesignationOpen} />
                <Designations />
            </Box>
        </div>
    )
}

export default DesignationsPage