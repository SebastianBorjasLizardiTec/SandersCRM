import { Layout as ReactAdminLayout, AppBar, Menu, useLogout } from "react-admin";
import { Card, CardContent } from "@mui/material";
import { Typography, Button } from "@mui/material"; // Added import for Typography
import { useNavigate } from 'react-router-dom';
import { logout } from './Utilities/authUtils'; // Import the logout function
import './styles/menuLayout.css'

// Custom AppBar
const CustomAppBar = (props: any) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function to clear the token
    navigate('/login'); // Redirect to the login page
  };

  return (
    <AppBar {...props} className="customAppBar" userMenu={<div>User</div>} style={{ backgroundColor: 'white', color: 'var(--our-dark-blue)' }}>
      <Typography variant="h6" sx={{ flex: 1 }} style={{ color: 'var(--our-dark-blue)' }}>
        DONNORHUB
      </Typography>
      <Button onClick={handleLogout} style={{ color: 'var(--our-dark-blue)' }}>
        Logout
      </Button>
    </AppBar>
  );
};

// Custom Sidebar
const CustomMenu = (props: any) => (
  <Menu {...props} className="customMenu">
    <button className='pinkButton'>
      {'Create Donor'}
    </button>
    <Menu.Item to="donations" sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} primaryText="Donations" />
    <Menu.Item to="donors" sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} primaryText="Donors" />
    <Menu.Item to="users" sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} primaryText="Users" />
  </Menu>
);

// Custom Layout
export const menuLayout = (props: any) => (
  <ReactAdminLayout {...props} appBar={CustomAppBar} menu={CustomMenu} />
);
