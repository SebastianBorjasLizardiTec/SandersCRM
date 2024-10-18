import { List, SimpleList, Datagrid, TextField, SelectInput, EditButton, Edit, SimpleForm, TextInput, Create, useNotify, useRefresh, useRedirect } from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

export const UserList = () => {
    const userRole = localStorage.getItem('userRole');
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    const canEdit = userRole === 'admin';

    return (
        <List actions={canEdit ? undefined : false} sx={{ backgroundColor: '#e0e0e0' }}>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => `${record.nombre} ${record.apellido}`}
                    secondaryText={(record) => `Email: ${record.email}`}
                    tertiaryText={(record) => `Rol: ${record.role}`}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="nombre" label="Nombre" />
                    <TextField source="apellido" label="Apellido" />
                    <TextField source="email" label="Email" />
                    <TextField source="role" label="Rol" />
                    {canEdit && <EditButton />}
                </Datagrid>
            )}
        </List>
    );
};

export const UserEdit = () => {
    const userRole = localStorage.getItem('userRole');
    const canEdit = userRole === 'admin';

    return (
        <Edit mutationOptions={{}}>
            <SimpleForm>
                <TextInput source="nombre" label="Nombre" />
                <TextInput source="apellido" label="Apellido" />
                <TextInput source="email" label="Email" />
                <SelectInput source="role" label="Rol" choices={[
                    { id: 'basic', name: 'Básico' },
                    { id: 'accountManager', name: 'Account Manager' },
                    { id: 'admin', name: 'Admin' }
                ]} />
            </SimpleForm>
        </Edit>
    );
};

export const UserCreate = () => {
    const userRole = localStorage.getItem('userRole');
    const canEdit = userRole === 'admin';

    return (
        <Create>
            <SimpleForm>
                <TextInput source="nombre" label="Nombre" />
                <TextInput source="apellido" label="Apellido" />
                <TextInput source="email" label="Email" />
                <SelectInput source="role" label="Rol" choices={[
                    { id: 'basic', name: 'Básico' },
                    { id: 'accountManager', name: 'Account Manager' },
                    { id: 'admin', name: 'Admin' }
                ]} />
            </SimpleForm>
        </Create>
    );
};
