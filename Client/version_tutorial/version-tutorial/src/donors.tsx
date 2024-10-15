import {List, required, SimpleList, Datagrid, TextField, EmailField, Filter, EditButton, Edit, SimpleForm, TextInput, ReferenceInput, Create, FilterProps, ReferenceField, NumberInput, useRedirect, useNotify, useRefresh} from "react-admin";
import {useMediaQuery, Theme} from "@mui/material";



export const DonorList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    const userRole = localStorage.getItem('userRole');
    const canEdit = userRole !== 'basic';

    return (
        <List actions={canEdit ? undefined : false}>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.nombre}
                    secondaryText={(record) => record.apellido}
                    tertiaryText={(record) => record.donationsAmount}
                />
            ) : (
                <Datagrid bulkActionButtons={canEdit ? undefined : false}>
                    <TextField source="id"/>
                    <TextField source="nombre"/>
                    <TextField source="apellido"/>
                    <EmailField source="email"/>
                    <TextField source="donationsAmount" label="Cantidad donada"/>
                    <TextField source="telefono"/>
                    <TextField source="frequency" label="Frecuencia"/>
                    <TextField source="tier"/>
                    {canEdit && <EditButton/>}
                </Datagrid>
            )}
        </List>
    );
};

export const DonorEdit = () => {
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
            <TextInput source="nombre" />
            <TextInput source="apellido" />
            <TextInput source="email" />
            <NumberInput source="donationsAmount" label = "Cantidad donada"/>
            <TextInput source="telefono" />
            <TextInput source="frequency" label = "Frecuencia"/>
            <TextInput source="tier" />
        </SimpleForm>    
    </Edit>
    )
}

export const DonorCreate = () => {
    const redirect = useRedirect();
const notify = useNotify();
const refresh = useRefresh();

const onSuccess = () => {
    notify('Donación actualizada correctamente'); // Mensaje de éxito
    redirect('/donations'); // Redirige a la lista de donaciones
    refresh(); // Refresca la vista
};
    return (
    <Create mutationOptions= {{ onSuccess }}>
        <SimpleForm>
            <TextInput source="nombre" />
            <TextInput source="apellido" />
            <TextInput source="email" />
            <NumberInput source="donationsAmount" label = "Cantidad donada" />
            <TextInput source="telefono" />
            <TextInput source="tier" />
        </SimpleForm>
    </Create>    
    )
}