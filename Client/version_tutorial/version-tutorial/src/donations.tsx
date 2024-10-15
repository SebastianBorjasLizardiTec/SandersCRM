import { List, required, SimpleList, Datagrid, TextField, 
    DateField, EditButton, Edit, SimpleForm, TextInput, ReferenceInput, Create, 
    FilterProps, NumberInput, SelectInput, useNotify, useRefresh, useRedirect } from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";


const handleFailure = (error: unknown) => {
    console.error(error); // Solo loguea el error sin notificación
    // Aquí podrías manejar el error de otra forma
};

export const DonationList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    const userRole = localStorage.getItem('userRole');
    const canEdit = userRole !== 'basic';

    return (
        <List actions={canEdit ? undefined : false}>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => `Donación de ${record.monto} ${record.moneda}`}
                    secondaryText={(record) => `Método: ${record.metodoPago}`}
                    tertiaryText={(record) => `Fecha: ${record.mesDonacion}`}
                />
            ) : (
                <Datagrid bulkActionButtons={canEdit ? undefined : false}>
                    <TextField source="id" />
                    <TextField source="nombre" label="Nombre del Donador" />
                    <TextField source="mesDonacion" label="Mes de Donación" />
                    <TextField source="monto" label="Monto" />
                    <TextField source="moneda" label="Moneda" />
                    <TextField source="metodoPago" label="Método de Pago" />
                    <TextField source="campana" label="Campaña" />
                    <TextField source="estado" label="Estado" />
                    {canEdit && <EditButton />}
                </Datagrid>
            )}
        </List>
    );
};

export const DonationEdit = () => {
    return (
        <Edit onFailure={handleFailure}>
            <SimpleForm warnWhenUnsavedChanges>
                <TextInput source="mesDonacion" label="Mes de Donación" />
                <NumberInput source="monto" label="Monto" />
                <TextInput source="moneda" label="Moneda" />
                <SelectInput source="metodoPago" label="Método de Pago" choices={[
                    { id: 'Tarjeta', name: 'Tarjeta' },
                    { id: 'Transferencia', name: 'Transferencia' },
                    { id: 'Efectivo', name: 'Efectivo' }
                ]} />
                <SelectInput source="frecuencia" label="Frecuencia" choices={[
                    { id: 'Unica', name: 'Única' },
                    { id: 'Mensual', name: 'Mensual' },
                    { id: 'Anual', name: 'Anual' }
                ]} />
                <TextInput source="campana" label="Campaña" />
                <TextInput source="estado" label="Estado" />
            </SimpleForm>
        </Edit>
    );
};

export const DonationCreate = () => {
    return (
        <Create>
            <SimpleForm warnWhenUnsavedChanges >
                <TextInput source="nombre" label="Nombre del Donador" />
                <TextInput source="apellido" label="Apellido del donador"/>
                <TextInput source="mesDonacion" label="Mes de Donación" />
                <NumberInput source="monto" label="Monto" />
                <TextInput source="moneda" label="Moneda" />
                <SelectInput source="metodoPago" label="Método de Pago" choices={[
                    { id: 'Tarjeta', name: 'Tarjeta' },
                    { id: 'Transferencia', name: 'Transferencia' },
                    { id: 'Efectivo', name: 'Efectivo' }
                ]} />
                <SelectInput source="frecuencia" label="Frecuencia" choices={[
                    { id: 'Unica', name: 'Única' },
                    { id: 'Mensual', name: 'Mensual' },
                    { id: 'Anual', name: 'Anual' }
                ]} />
                <SelectInput source="campana" label="Campaña" choices={[
                    { id: 'Agua', name: 'Agua' },
                    { id: 'Nutricion', name: 'Nutrición' },
                    { id: 'Otra', name: 'Otra' }
                ]} />
                <TextInput source="estado" label="Estado" />
            </SimpleForm>
        </Create>
    );
};
