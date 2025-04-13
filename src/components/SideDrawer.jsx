import { BadgeOutlined, Domain, People } from '@mui/icons-material';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const SideDrawer = ({ key, drawerItems, isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <Drawer open={isOpen} onClose={() => { setIsOpen(false); }}>
            <Box width={250} height={100} bgcolor={'white'} >
                <List>
                    {drawerItems.map((item) =>
                        <ListItem key={item.link} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    setIsOpen(false);
                                    if (location.pathname === item.link) return;
                                    navigate(item.link);
                                }}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            </Box>
        </Drawer>
    )
}

export default SideDrawer