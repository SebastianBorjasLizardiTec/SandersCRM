import { List, SimpleList, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, FilterProps, useNotify, useRefresh, useRedirect } from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";


export const UserList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List>
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
        <Edit mutationOptions= {{ onSuccess }}>
            <SimpleForm>
                <TextInput source="nombre" label="Nombre" />
                <TextInput source="apellido" label="Apellido" />
                <TextInput source="email" label="Email" />
                <TextInput source="role" label="Rol" />
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
