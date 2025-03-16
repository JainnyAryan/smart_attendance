import React, { useState } from 'react';
import Departments from '../../components/Departments';
import Navbar from '../../components/Navbar';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import AddDepartment from '../../components/AddDepartment';

const DepartmentsPage = () => {
    const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
    const [refreshListFlag, setRefreshListFlag] = useState(false);
    const [editDepartmentData, setEditDepartmentData] = useState(null);

    const openEditDialog = (department) => {
        setEditDepartmentData(department);
        setIsAddDepartmentOpen(true);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Navbar titleText={'Departments'} />

            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Button variant="contained" onClick={() => { setEditDepartmentData(null); setIsAddDepartmentOpen(true); }}>
                    <Add sx={{ marginRight: 1 }} /> Add Department
                </Button>
            </Box>

            <AddDepartment
                triggerRefreshListFlag={() => setRefreshListFlag(!refreshListFlag)}
                isOpen={isAddDepartmentOpen}
                setIsOpen={setIsAddDepartmentOpen}
                isEditMode={!!editDepartmentData}
                onCloseEditMode={() => setEditDepartmentData(null)}
                departmentData={editDepartmentData}
            />

            <Departments refreshListFlag={refreshListFlag} openEditDialog={openEditDialog} />
        </Box>
    );
};

export default DepartmentsPage;