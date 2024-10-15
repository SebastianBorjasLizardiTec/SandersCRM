import {
    List,
    SimpleList,
    Datagrid,
    TextField,
    NumberInput,
    SelectInput,
    useNotify,
    useRefresh,
    useRedirect,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    EditButton
} from "react-admin";
import { useMediaQuery, Theme } from "@mui/material";

export const DonationList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    const userRole = localStorage.getItem('userRole');
    const canEdit = userRole !== 'basic';

    return (
        <List actions={canEdit ? undefined : false} sx={{ backgroundColor: '#e0e0e0' }}>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => `Donación de ${record.monto} ${record.moneda}`}
                    secondaryText={(record) => `Método: ${record.metodoPago}`}
                    tertiaryText={(record) => `Fecha: ${record.fechaDonacion}`}
                />
            ) : (
                <Datagrid bulkActionButtons={canEdit ? undefined : false}>
                    <TextField source="id" />
                    <TextField source="nombre" label="Nombre del Donador" />
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
        notify('Donación actualizada correctamente');
        redirect('/donations');
        refresh();
    };

    return (
        <Edit mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <TextInput source="nombre" label="Nombre del Donador" validate={required()} />
                <TextInput source="apellido" label="Apellido del donador" validate={required()} />
                <NumberInput source="monto" label="Monto" validate={[required(), validateAmount]} />
                <SelectInput
                    source="moneda"
                    label="Moneda"
                    choices={[
                        { id: 'MX', name: 'Pesos Mexicanos (MX)' },
                        { id: 'USD', name: 'Dólares Estadounidenses (USD)' }
                    ]}
                    defaultValue="MX"
                    validate={required()}
                />
                <SelectInput source="metodoPago" label="Método de Pago" choices={[
                    { id: 'Tarjeta', name: 'Tarjeta' },
                    { id: 'Transferencia', name: 'Transferencia' },
                    { id: 'Efectivo', name: 'Efectivo' }
                ]} validate={required()} />
                <SelectInput source="frecuencia" label="Frecuencia" choices={[
                    { id: 'Unica', name: 'Única' },
                    { id: 'Mensual', name: 'Mensual' },
                    { id: 'Anual', name: 'Anual' }
                ]} validate={required()} />
                <TextInput source="campana" label="Campaña" validate={required()} />
                <SelectInput source="estado" label="Estado" choices={estados} validate={required()} />
            </SimpleForm>
        </Edit>
    );
};

export const DonationCreate = () => {
    const redirect = useRedirect();
    const notify = useNotify();
    const refresh = useRefresh();

    const onSuccess = () => {
        notify('Donación creada correctamente');
        redirect('/donations');
        refresh();
    };

    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <TextInput source="nombre" label="Nombre del Donador" validate={required()} />
                <TextInput source="apellido" label="Apellido del donador" validate={required()} />
                <NumberInput source="monto" label="Monto" validate={[required(), validateAmount]} />
                <SelectInput
                    source="moneda"
                    label="Moneda"
                    choices={[
                        { id: 'MX', name: 'Pesos Mexicanos (MX)' },
                        { id: 'USD', name: 'Dólares (USD)' }
                    ]}
                    defaultValue="MX"
                    validate={required()}
                />
                <SelectInput source="metodoPago" label="Método de Pago" choices={[
                    { id: 'Tarjeta', name: 'Tarjeta' },
                    { id: 'Transferencia', name: 'Transferencia' },
                    { id: 'Efectivo', name: 'Efectivo' }
                ]} validate={required()} />
                <SelectInput source="frecuencia" label="Frecuencia" choices={[
                    { id: 'Unica', name: 'Única' },
                    { id: 'Mensual', name: 'Mensual' },
                    { id: 'Anual', name: 'Anual' }
                ]} validate={required()} />
                <SelectInput source="campana" label="Campaña" choices={[
                    { id: 'Agua', name: 'Agua' },
                    { id: 'Nutricion', name: 'Nutrición' },
                    { id: 'Otra', name: 'Otra' }
                ]} validate={required()} />
                <SelectInput source="estado" label="Estado" choices={estados} validate={required()} />
            </SimpleForm>
        </Create>
    );
};

const estados = [
    { id: 'Aguascalientes', name: 'Aguascalientes' },
    { id: 'Baja California', name: 'Baja California' },
    { id: 'Baja California Sur', name: 'Baja California Sur' },
    { id: 'Campeche', name: 'Campeche' },
    { id: 'Chiapas', name: 'Chiapas' },
    { id: 'Chihuahua', name: 'Chihuahua' },
    { id: 'Ciudad De México', name: 'Ciudad De México' },
    { id: 'Coahuila', name: 'Coahuila' },
    { id: 'Colima', name: 'Colima' },
    { id: 'Durango', name: 'Durango' },
    { id: 'Guanajuato', name: 'Guanajuato' },
    { id: 'Guerrero', name: 'Guerrero' },
    { id: 'Hidalgo', name: 'Hidalgo' },
    { id: 'Jalisco', name: 'Jalisco' },
    { id: 'Mexico', name: 'Estado de México' },
    { id: 'Michoacán', name: 'Michoacán' },
    { id: 'Morelos', name: 'Morelos' },
    { id: 'Nayarit', name: 'Nayarit' },
    { id: 'Nuevo León', name: 'Nuevo León' },
    { id: 'Oaxaca', name: 'Oaxaca' },
    { id: 'Puebla', name: 'Puebla' },
    { id: 'Querétaro', name: 'Querétaro' },
    { id: 'Quintana Roo', name: 'Quintana Roo' },
    { id: 'San Luis Potosí', name: 'San Luis Potosí' },
    { id: 'Sinaloa', name: 'Sinaloa' },
    { id: 'Sonora', name: 'Sonora' },
    { id: 'Tabasco', name: 'Tabasco' },
    { id: 'Tamaulipas', name: 'Tamaulipas' },
    { id: 'Tlaxcala', name: 'Tlaxcala' },
    { id: 'Veracruz', name: 'Veracruz' },
    { id: 'Yucatán', name: 'Yucatán' },
    { id: 'Zacatecas', name: 'Zacatecas' },
];

const validateAmount = (value: number) => {
    if (value < 0) {
        return 'El monto no puede ser negativo';
    }
    if (value < 20) {
        return 'El monto mínimo son 20 pesos';
    }
    if (value > 150000) {
        return 'El monto máximo son 150,000 pesos';
    }
    return undefined;
};

const required = (message = 'Este campo es obligatorio') => (value: any) => (value ? undefined : message);
