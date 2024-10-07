import { Layout as ReactAdminLayout, AppBar, Menu, Button } from "react-admin";
import { Card, CardContent } from "@mui/material";
import { Typography } from "@mui/material"; // Added import for Typography
import '../styles/menu.css'

// Custom AppBar
const CustomAppBar = (props: any) => (
  <AppBar {...props} className="customAppBar" userMenu={<div>User</div>} > 
  <Typography variant="h6"  sx={{ flex: 1 }} color="var(--our-dark-blue)">DONNORHUB</Typography>
  </AppBar>
);

// Custom Sidebar
const CustomMenu = (props: any) => (
  <Menu {...props} className="customMenu">
    <button className='pinkButton'>
            { 'Create Donor'}
    </button>
    <Menu.Item to= "donations" sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} primaryText="Donations" />
    <Menu.Item to="donors" sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} primaryText="Donors"  />
    <Menu.Item to="users" sx={{ color: 'var(--our-dark-blue)', fontWeight: '800' }} primaryText="Users" />
  </Menu>
);

// Custom Layout
export const menu = (props: any) => (
  <ReactAdminLayout {...props} appBar={CustomAppBar} menu={CustomMenu} />
);
