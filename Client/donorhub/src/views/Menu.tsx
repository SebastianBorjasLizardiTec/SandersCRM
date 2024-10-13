import { Layout as ReactAdminLayout, AppBar, Menu, useGetIdentity } from "react-admin";
import { Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { logout } from '../Utilities/authUtils';
import PersonIcon from '@mui/icons-material/Person';
import React, { useState } from 'react';
import UserProfileWidget from '../Widgets/UserProfileWidget';
import '../styles/menu.css'

// Custom AppBar
const CustomAppBar = (props: any) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUserClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBar {...props} className="customAppBar" style={{ backgroundColor: 'white', color: 'var(--our-dark-blue)' }}>
        <Typography variant="h6" sx={{ flex: 1 }} style={{ color: 'var(--our-dark-blue)' }}>
          DONNORHUB
        </Typography>
        <IconButton 
          color="inherit" 
          aria-label="user" 
          onClick={handleUserClick}
        >
          <PersonIcon />
        </IconButton>
        <Button onClick={handleLogout} style={{ color: 'var(--our-dark-blue)' }}>
          Logout
        </Button>
      </AppBar>

      <UserProfileWidget open={open} onClose={handleClose} />
    </>
  );
};

// Custom Sidebar
const CustomMenu = (props: any) => {
  const { identity } = useGetIdentity();
  const isAdmin = identity?.role === 'admin';

  return (
    <Menu {...props} className="customMenu">
      <Menu.Item to="donations" sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} primaryText="Donations" />
      <Menu.Item to="donors" sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} primaryText="Donors" />
      {isAdmin && <Menu.Item to="users" sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} primaryText="Users" />}
    </Menu>
  );
};

// Custom Layout
export const menu = (props: any) => (
  <ReactAdminLayout {...props} appBar={CustomAppBar} menu={CustomMenu} />
);
