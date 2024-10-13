import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
  Create, // or CreateBase
} from "react-admin";
import { menuLayout } from "./MenuLayout";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { authProvider } from "./authProvider";
import jsonServerProvider from "ra-data-json-server";
import { isAuthenticated } from "./Utilities/authUtils";
import Dashboard from "./Dashboard";
import Login from "./login";
import UserProfileWidget from "./Widgets/UserProfileWidget";

const dataProvider = jsonServerProvider("https://localhost:5000/api");

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

export const App = () => {
  const userRole = localStorage.getItem('userRole');
  const isBasic = userRole === 'basic';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedRoute element={
          <Admin darkTheme={null} layout={menuLayout} dashboard={Dashboard} dataProvider={dataProvider}>
            <Resource 
              name="donors" 
              list={ListGuesser} 
              edit={isBasic ? undefined : EditGuesser} 
              show={ShowGuesser}
              create={isBasic ? undefined : Create}
              recordRepresentation="name"
            />
          </Admin>
        } />} />
      </Routes>
    </Router>
  );
};
