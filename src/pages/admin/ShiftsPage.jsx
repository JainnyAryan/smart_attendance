import React, { useState } from 'react';
import Shifts from '../../components/Shifts';
import Navbar from '../../components/Navbar';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import AddShift from '../../components/AddShift';

const ShiftsPage = () => {
    const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
    const [refreshListFlag, setRefreshListFlag] = useState(false);
    const [editShiftData, setEditShiftData] = useState(null);

    const openEditDialog = (shift) => {
        setEditShiftData(shift);
        setIsAddShiftOpen(true);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Navbar titleText={'Shifts'} />

            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Button variant="contained" onClick={() => { setEditShiftData(null); setIsAddShiftOpen(true); }}>
                    <Add sx={{ marginRight: 1 }} /> Add Shift
                </Button>
            </Box>

            <AddShift
                triggerRefreshListFlag={() => setRefreshListFlag(!refreshListFlag)}
                isOpen={isAddShiftOpen}
                setIsOpen={setIsAddShiftOpen}
                isEditMode={!!editShiftData}
                shiftData={editShiftData}
            />

            <Shifts refreshListFlag={refreshListFlag} openEditDialog={openEditDialog} />
        </Box>
    );
};

export default ShiftsPage;