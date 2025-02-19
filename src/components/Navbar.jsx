import {
    AppBar,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Toolbar,
    Typography
} from '@mui/material';
import { IconClock } from '@tabler/icons-react'
import React, { useState } from 'react';
import { Menu, Person, BadgeOutlined, Domain, People, Dashboard } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideDrawer from './SideDrawer';
import EmployeeDashboard from './EmployeeDashboard';

const Navbar = ({ titleText, actions }) => {
    const [isSignoutOpen, setIsSignoutOpen] = useState(false);
    const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedPageIndex, setSelectedPageIndex] = useState(0);
    const adminDrawerItems = [
        {
            icon: <Dashboard />,
            title: "Dashboard",
            link: '/admin',
        },
        {
            icon: <People />,
            title: "Employees",
            link: '/admin/employees',
        },
        {
            icon: <Domain />,
            title: "Departments",
            link: '/admin/departments',
        },
        {
            icon: <BadgeOutlined />,
            title: "Designations",
            link: '/admin/designations',
        },
        {
            icon: <IconClock />,
            title: "Shifts",
            link: '/admin/shifts',
        },
    ];

    const employeeDrawerItems = [
        {
            icon: <Dashboard />,
            title: "Dashboard",
            link: '/dashboard',
        },

    ];


    const handleSignout = () => {
        setIsLoading(true);
        logout(navigate);
        setIsLoading(false);
    };

    const handleSignoutOpen = () => {
        setIsSignoutOpen(true);
    };

    const handleSignoutClose = () => {
        setIsSignoutOpen(false);
    };

    return (
        <div style={{ width: '100%' }}>
            <AppBar
                position="static"
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <SideDrawer drawerItems={user.is_admin ? adminDrawerItems : employeeDrawerItems} isOpen={isSideDrawerOpen} setIsOpen={setIsSideDrawerOpen} />
                <Toolbar>
                    <IconButton children={<Menu />} style={{ color: "white" }} onClick={() => { setIsSideDrawerOpen(!isSideDrawerOpen); }} />
                    <Box padding={1} />
                    <Typography variant="h5" component="div">
                        {titleText}
                    </Typography>
                </Toolbar>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                    <Toolbar>
                        <Typography>
                            Hello, {user?.email}
                        </Typography>
                        <Avatar variant="text" onClick={handleSignoutOpen} style={{ marginLeft: "20px" }}>
                            <Person sx={{ color: 'white' }} />
                        </Avatar>
                    </Toolbar>
                </Box>
            </AppBar>
            <Dialog open={isSignoutOpen} onClose={handleSignoutClose}>
                <DialogTitle>{"Logout"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to logout?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSignoutClose} disabled={isLoading}>
                        No
                    </Button>
                    <Button color="error" onClick={handleSignout} disabled={isLoading}>
                        Signout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Navbar;
