import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './views/login';
import Donors from './views/Donors';
import { isAuthenticated } from './Utilities/authUtils';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/donors/*" element={<ProtectedRoute element={<Donors />} />} />
      </Routes>
    </Router>
  );
};

export default App;