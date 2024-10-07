import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './views/login';
import Donations from './views/Donations';
import { isAuthenticated } from './Utilities/authUtils';
import SignUp from './views/SignUp';
import ResetPassword from './views/ResetPassword';



const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/donations" element={<ProtectedRoute element={<Donations />} />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;