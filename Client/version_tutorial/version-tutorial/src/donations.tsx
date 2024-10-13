import { List, required, SimpleList, Datagrid, TextField, DateField, EditButton, Edit, SimpleForm, TextInput, ReferenceInput, Create, FilterProps, NumberInput, SelectInput } from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";



const handleFailure = (error: unknown) => {
    console.error(error); // Solo loguea el error sin notificación
    // Aquí podrías manejar el error de otra forma
};

export const DonationList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => `Donación de ${record.monto} ${record.moneda}`}
                    secondaryText={(record) => `Método: ${record.metodoPago}`}
                    tertiaryText={(record) => `Fecha: ${record.fechaDonacion}`}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="donorId" label="ID del Donante" />
                    <DateField source="fechaDonacion" label="Fecha de Donación" />
                    <TextField source="monto" label="Monto" />
                    <TextField source="moneda" label="Moneda" />
                    <TextField source="metodoPago" label="Método de Pago" />
                    <TextField source="frecuencia" label="Frecuencia" />
                    <TextField source="campana" label="Campaña" />
                    <TextField source="estado" label="Estado" />
                    <EditButton />
                </Datagrid>
            )}
        </List>
    );
};

export const DonationEdit = () => {
    return (
        <Edit onFailure={handleFailure}>
            <SimpleForm>
                <TextInput source="donorId" label="ID del Donante" />
                <DateField source="fechaDonacion" label="Fecha de Donación" />
                <NumberInput source="monto" label="Monto" />
                <TextInput source="moneda" label="Moneda" />
                <SelectInput source="metodoPago" label="Método de Pago" choices={[
                    { id: 'tarjeta', name: 'Tarjeta' },
                    { id: 'transferencia', name: 'Transferencia' },
                    { id: 'efectivo', name: 'Efectivo' }
                ]} />
                <TextInput source="frecuencia" label="Frecuencia" />
                <TextInput source="campana" label="Campaña" />
                <TextInput source="estado" label="Estado" />
            </SimpleForm>
        </Edit>
    );
};

export const DonationCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="donorId" label="ID del Donante" />
                <DateField source="fechaDonacion" label="Fecha de Donación" />
                <NumberInput source="monto" label="Monto" />
                <TextInput source="moneda" label="Moneda" />
                <SelectInput source="metodoPago" label="Método de Pago" choices={[
                    { id: 'tarjeta', name: 'Tarjeta' },
                    { id: 'transferencia', name: 'Transferencia' },
                    { id: 'efectivo', name: 'Efectivo' }
                ]} />
                <TextInput source="frecuencia" label="Frecuencia" />
                <TextInput source="campana" label="Campaña" />
                <TextInput source="estado" label="Estado" />
            </SimpleForm>
        </Create>
    );
};
