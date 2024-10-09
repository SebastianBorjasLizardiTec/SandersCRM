import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { menuLayout } from "./MenuLayout";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { authProvider } from "./authProvider";
import jsonServerProvider from "ra-data-json-server";
import { isAuthenticated } from "./Utilities/authUtils";
import Dashboard from "./Dashboard";
import Login from "./login";

const dataProvider = jsonServerProvider("https://localhost:5000/api");

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

export const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<ProtectedRoute element={
        <Admin layout={menuLayout} dashboard={Dashboard} dataProvider={dataProvider}>
          <Resource name="donors" list={ListGuesser} edit={EditGuesser} show={ShowGuesser}/>
        </Admin>
      } />} />
    </Routes>
  </Router>
);
