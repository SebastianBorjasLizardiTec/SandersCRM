import React from 'react';
import { Resource, List, Datagrid, TextField, NumberField, DateField, Create, SimpleForm, TextInput, NumberInput, Edit } from 'react-admin';
import { dataProvider } from '../providers/dataprovider';

const DonorList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="nombre" />
      <TextField source="apellido" />
      <TextField source="email" />
      <NumberField source="donationsAmount" />
      <TextField source="telefono" />
      <TextField source="frequency" />
      <TextField source="tier" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

const DonorCreate = (props: any) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="nombre" />
      <TextInput source="apellido" />
      <TextInput source="email" />
      <NumberInput source="donationsAmount" />
      <TextInput source="telefono" />
      <TextInput source="frequency" />
      <TextInput source="tier" />
    </SimpleForm>
  </Create>
);

const DonorEdit = (props: any) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="nombre" />
      <TextInput source="apellido" />
      <TextInput source="email" />
      <NumberInput source="donationsAmount" />
      <TextInput source="telefono" />
      <TextInput source="frequency" />
      <TextInput source="tier" />
    </SimpleForm>
  </Edit>
);

const Donors = () => (
  <Resource name="donors" list={DonorList} create={DonorCreate} edit={DonorEdit} />
);

export default Donors;
