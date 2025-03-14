import React, { useState } from 'react';
import Projects from '../../components/Projects';
import Navbar from '../../components/Navbar';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import AddProject from '../../components/AddProject';

const ProjectsPage = () => {
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
    const [refreshListFlag, setRefreshListFlag] = useState(false);
    const [editProjectData, setEditProjectData] = useState(null);

    const openEditDialog = (project) => {
        setEditProjectData(project);
        setIsAddProjectOpen(true);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Navbar titleText={'Projects'} />

            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <Button variant="contained" onClick={() => { setEditProjectData(null); setIsAddProjectOpen(true); }}>
                    <Add sx={{ marginRight: 1 }} /> Add Project
                </Button>
            </Box>

            <AddProject
                triggerRefreshListFlag={() => setRefreshListFlag(!refreshListFlag)}
                isOpen={isAddProjectOpen}
                setIsOpen={setIsAddProjectOpen}
                isEditMode={!!editProjectData}
                projectData={editProjectData}
            />

            <Projects refreshListFlag={refreshListFlag} openEditDialog={openEditDialog} />
        </Box>
    );
};

export default ProjectsPage;