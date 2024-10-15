import { Layout as ReactAdminLayout, AppBar, Menu } from "react-admin";
import { Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { logout } from './Utilities/authUtils';
import PersonIcon from '@mui/icons-material/Person';
import React, { useState } from 'react';
import UserProfileWidget from './Widgets/UserProfileWidget'; // Import the new component
import './styles/menuLayout.css'
import { useGetIdentity } from 'react-admin';

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
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';
  const isBasic = userRole === 'basic';

  return (
    <Menu {...props} className="customMenu">
      <Menu.DashboardItem
      style={{ color: 'var(--our-pink)', fontWeight: '800' }}/>
      <Menu.Item 
        to="donations" 
        sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} 
        primaryText="Donaciones" />
      <Menu.Item 
        to="donors" 
        sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} 
        primaryText="Donadores" 
        state={{ userRole }}
      />
      {isAdmin && (
        <Menu.Item to="users" sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} primaryText="Usuarios" />
      )}
    </Menu>
  );
};

// Custom Layout
export const menuLayout = (props: any) => (
  <ReactAdminLayout {...props} appBar={CustomAppBar} menu={CustomMenu} />
);
