import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { Box, Button } from '@mui/material'
import Shifts from '../../components/Shifts'
import AddShift from '../../components/AddShift'
import { Add } from '@mui/icons-material'

const ShiftsPage = () => {
    const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Navbar titleText={'Shifts'} />
            <Box padding={2}>
                <Button variant='contained' onClick={() => { setIsAddShiftOpen(true); }}><Add style={{ marginRight: "10px" }} />Add Shifts</Button>
                <AddShift isOpen={isAddShiftOpen} setIsOpen={setIsAddShiftOpen} />
                <Shifts />
            </Box>
        </div>
    )
}

export default ShiftsPage;