import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Admin, Resource } from 'react-admin'; // Add these imports
import jsonServerProvider from 'ra-data-json-server'; // Import the JSON server provider
import Login from './views/login';
import { DonationList, DonationEdit, DonationCreate } from './views/Donations';
import { isAuthenticated } from './Utilities/authUtils';

const dataProvider = jsonServerProvider('http://localhost:3000'); // Set up the data provider

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={
          <Admin dataProvider={dataProvider}>
            <Resource name="donations" list={DonationList} edit={DonationEdit} create={DonationCreate} />
          </Admin>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/donations" element={<ProtectedRoute element={<DonationList />} />} />
      </Routes>
    </Router>
  );
};

export default App;