import { List, required, SimpleList, Datagrid, TextField, 
    DateField, EditButton, Edit, SimpleForm, TextInput, ReferenceInput, Create, 
    FilterProps, NumberInput, SelectInput, useNotify, useRefresh, useRedirect, TopToolbar, CreateButton } from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";





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
            <SimpleForm >
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
    const redirect = useRedirect();
const notify = useNotify();
const refresh = useRefresh();

const onSuccess = () => {
    notify('Donación creada correctamente'); // Mensaje de éxito
    redirect('/donations'); // Redirige a la lista de donaciones
    refresh(); // Refresca la vista
};
    return (
        <Create mutationOptions= {{ onSuccess }}>
            <SimpleForm  >
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