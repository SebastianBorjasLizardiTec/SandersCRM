import {List, required, SimpleList, Datagrid, TextField, EmailField, Filter, EditButton, Edit, SimpleForm, TextInput, ReferenceInput, Create, FilterProps, ReferenceField, NumberInput} from "react-admin";
import {useMediaQuery, Theme} from "@mui/material";


const UserFilter = (props: FilterProps) => (
    <Filter {...props}>
        <TextInput label="Search by name" source="name" alwaysOn />
    </Filter>
);

const handleFailure = (error: unknown) => {
    console.error(error); // Solo loguea el error sin notificación
    // Aquí podrías manejar el error de otra forma
};

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
    return (
    <Edit onFailure={handleFailure}>
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
    return (
    <Create >
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
