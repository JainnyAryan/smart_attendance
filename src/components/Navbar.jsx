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
import { IconArrowLeftCircle, IconClock, IconClock12 } from '@tabler/icons-react'
import React, { useState } from 'react';
import { Menu, Person, BadgeOutlined, Domain, People, Dashboard, TimeToLeave, ComputerOutlined, ArrowLeft, ArrowBack, Folder, Logout, Work, Chat } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideDrawer from './SideDrawer';
import EmployeeDashboard from './EmployeeDashboard';

const Navbar = ({ titleText, actions, needsBackButton }) => {
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
            iconColor: "#",
            title: "Dashboard",
            link: '/admin',
        },
        {
            icon: <People />,
            iconColor: "#3f51b5",
            title: "Employees",
            link: '/admin/employees',
        },
        {
            icon: <Work />,
            iconColor: "#795548",
            title: "Projects",
            link: '/admin/projects',
        },
        {
            icon: <Domain />,
            iconColor: "#f50057",
            title: "Departments",
            link: '/admin/departments',
        },
        {
            icon: <BadgeOutlined />,
            iconColor: "#4caf50",
            title: "Designations",
            link: '/admin/designations',
        },
        {
            icon: <IconClock />,
            iconColor: "#ff9800",
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
        {
            icon: <ComputerOutlined />,
            title: "System Logs",
            link: '/systemlogs',
        }
    ];


    const handleSignout = () => {
        setIsLoading(true);
        logout(navigate, true);
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
                    {!needsBackButton ?
                        <IconButton children={<Menu />} style={{ color: "white" }} onClick={() => { setIsSideDrawerOpen(!isSideDrawerOpen); }} />
                        : <IconButton children={<ArrowBack />} style={{ color: "white" }} onClick={() => { navigate(-1); }} />
                    }
                    <Box padding={0.7} />
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem", lg: "1.65rem" } }}
                    >
                        {titleText}
                    </Typography>
                </Toolbar>
                <Button
                    sx={{ display: "flex", alignItems: "center", gap: 1, marginRight: 2, color: "#1976d2", backgroundColor: "white" }}
                    onClick={() => { navigate(`/${user.is_admin ? 'admin/' : ""}chatbot`); }}
                    variant='contained'
                >
                    <Chat /> ChatBot
                </Button>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Toolbar sx={{ paddingLeft: 0, paddingRight: 0, padding: 0 }}>
                        <Typography variant='body2' sx={{ textAlign: "end" }}>
                            Hello, {user?.email}
                        </Typography>
                        <Box width={1} />
                        <IconButton onClick={handleSignoutOpen}>
                            <Logout sx={{ color: 'white' }} />
                        </IconButton>
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
        </div >
    );
};

export default Navbar;
