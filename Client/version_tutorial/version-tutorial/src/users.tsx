import { List, SimpleList, Datagrid, TextField, SelectInput, EditButton, Edit, SimpleForm, TextInput, Create, useNotify, useRefresh, useRedirect } from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

export const UserList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    const canEdit = true; // Define el valor de canEdit según tu lógica

    return (
        <List actions={canEdit ? undefined : false} sx={{ backgroundColor: '#ff7c39' }}>
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
                    <EditButton />
                </Datagrid>
            )}
        </List>
    );
};


export const UserEdit = () => {
    
const redirect = useRedirect();
const notify = useNotify();
const refresh = useRefresh();

const onSuccess = () => {
    notify('Donación actualizada correctamente'); // Mensaje de éxito
    redirect('/donations'); // Redirige a la lista de donaciones
    refresh(); // Refresca la vista
};

    return (
        <Edit mutationOptions= {{  }}>
            <SimpleForm>
                <TextInput source="nombre" label="Nombre" />
                <TextInput source="apellido" label="Apellido" />
                <TextInput source="email" label="Email" />
                <SelectInput source="role" label="Rol" choices={[
                    { id: 'basic', name: 'Básico' },
                    { id: 'accountManager', name: 'Account Manager' },
                    { id: 'admin', name: 'Admin' }
                ]}/>
            </SimpleForm>
        </Edit>
    );
};

export const UserCreate = () => {
    return (
        <Create>
            <SimpleForm >
                <TextInput source="nombre" label="Nombre" />
                <TextInput source="apellido" label="Apellido" />
                <TextInput source="email" label="Email" />
                <TextInput source="role" label="Rol" />
            </SimpleForm>
        </Create>
    );
};
