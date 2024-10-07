import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './views/login';
import Donors from './views/Donors';
import { isAuthenticated } from './Utilities/authUtils';
import { Admin, Resource } from 'react-admin';
import { Home } from './views/Home';
import Users from './views/Users';
//import Donations from './views/Donations';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home/*" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/donors" element={<Donors />} />
        <Route path="/home/users" element={<Users />} />
      </Routes>
    </Router> 
  );
};

export default App;