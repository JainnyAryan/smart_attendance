import React, { useState } from 'react';
import Designations from '../../components/Designations';
import Navbar from '../../components/Navbar';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import AddDesignation from '../../components/AddDesignation';

const DesignationsPage = () => {
    const [isAddDesignationOpen, setIsAddDesignationOpen] = useState(false);
    const [refreshListFlag, setRefreshListFlag] = useState(false);
    const [editDesignationData, setEditDesignationData] = useState(null);

    const openEditDialog = (designation) => {
        setEditDesignationData(designation);
        setIsAddDesignationOpen(true);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Navbar titleText={'Designations'} />

            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Button variant="contained" onClick={() => { setEditDesignationData(null); setIsAddDesignationOpen(true); }}>
                    <Add sx={{ marginRight: 1 }} /> Add Designation
                </Button>
            </Box>

            <AddDesignation
                triggerRefreshListFlag={() => setRefreshListFlag(!refreshListFlag)}
                isOpen={isAddDesignationOpen}
                setIsOpen={setIsAddDesignationOpen}
                isEditMode={!!editDesignationData}
                onCloseEditMode={() => setEditDesignationData(null)}
                designationData={editDesignationData}
            />

            <Designations refreshListFlag={refreshListFlag} openEditDialog={openEditDialog} />
        </Box>
    );
};

export default DesignationsPage;