import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Admin, Resource } from 'react-admin';
import Login from './views/login';
import { isAuthenticated } from './Utilities/authUtils';
import { menu } from './views/Menu';
import Dashboard from './views/Dashboard';
import Donors from './views/Donors';
import Users from './views/Users';
import { dataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute
              element={
                <Admin
                  layout={menu}
                  dashboard={Dashboard}
                  dataProvider={dataProvider}
                  authProvider={authProvider}
                >
                  <Resource name="donors" {...Donors} />
                  <Resource name="users" {...Users} />
                </Admin>
              }
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
