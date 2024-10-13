import {Card, CardContent, CardHeader} from "@mui/material";
import { Admin, EditGuesser, ListGuesser, Resource } from 'react-admin';
import { menu } from './Menu';
import Dashboard from './Dashboard'; // Updated import statement
import { dataProvider } from './dataProvider';

export const Home = () => (
    <Admin layout={menu} dashboard={Dashboard} dataProvider={dataProvider}>
     <Resource name="users" list={ListGuesser} edit={EditGuesser} />   
     <Resource name="donors" list={ListGuesser} edit={EditGuesser} />   
     <Resource name="donations" list={ListGuesser} edit={EditGuesser} />   
    </Admin>
  );