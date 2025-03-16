import React, { useState } from 'react';
import Employees from '../../components/Employees';
import Navbar from '../../components/Navbar';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import AddEmployee from '../../components/AddEmployee';

const EmployeesPage = () => {
    const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
    const [refreshListFlag, setRefreshListFlag] = useState(false);
    const [editEmployeeData, setEditEmployeeData] = useState(null);

    const openEditDialog = (employee) => {
        setEditEmployeeData(employee);
        setIsAddEmployeeOpen(true);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Navbar titleText={'Employees'} />

            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Button variant="contained" onClick={() => { setEditEmployeeData(null); setIsAddEmployeeOpen(true); }}>
                    <Add sx={{ marginRight: 1 }} /> Add Employee
                </Button>
            </Box>

            <AddEmployee
                triggerRefreshListFlag={() => setRefreshListFlag(!refreshListFlag)}
                isOpen={isAddEmployeeOpen}
                setIsOpen={setIsAddEmployeeOpen}
                isEditMode={!!editEmployeeData}
                onCloseEditMode={() => setEditEmployeeData(null)}
                employeeData={editEmployeeData}
            />

            <Employees refreshListFlag={refreshListFlag} openEditDialog={openEditDialog} />
        </Box>
    );
};

export default EmployeesPage;