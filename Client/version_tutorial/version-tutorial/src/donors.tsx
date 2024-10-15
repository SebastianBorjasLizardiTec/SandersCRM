import {
    List,
    required,
    SimpleList,
    Datagrid,
    TextField,
    EmailField,
    Filter,
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    ReferenceInput,
    Create,
    FilterProps,
    ReferenceField,
    NumberInput,
    useRedirect,
    useNotify,
    useRefresh,
} from 'react-admin';
import { useMediaQuery, Theme } from '@mui/material';

// Validación personalizada para el email
const emailValidator = (value: string) => {
    return value && !value.includes('@') ? 'El campo debe contener un @' : undefined;
};

// Validación personalizada para el teléfono
const phoneValidator = (value: string) => {
    return value && (value.length !== 10 || isNaN(Number(value))) 
        ? 'El teléfono debe contener exactamente 10 dígitos numéricos' 
        : undefined;
};

// Validación personalizada para la cantidad donada
const donationsAmountValidator = (value: number) => {
    return value < 0 ? 'La cantidad donada no puede ser un número negativo' : undefined;
};

export const DonorList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
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
                    <TextField source="id" />
                    <TextField source="nombre" />
                    <TextField source="apellido" />
                    <EmailField source="email" />
                    <TextField source="donationsAmount" label="Cantidad donada" />
                    <TextField source="telefono" />
                    <TextField source="tier" />
                    {canEdit && <EditButton />}
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
        notify('Donador actualizado correctamente'); // Mensaje de éxito
        redirect('/donors'); // Redirige a la lista de donadores
        refresh(); // Refresca la vista
    };

    return (
        <Edit mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <TextInput source="nombre" validate={required()} />
                <TextInput source="apellido" validate={required()} />
                <TextInput source="email" validate={[required(), emailValidator]} />
                <NumberInput 
                    source="donationsAmount" 
                    label="Cantidad donada" 
                    validate={[required(), donationsAmountValidator]} 
                />
                <TextInput source="telefono" validate={[required(), phoneValidator]} />
                <TextInput source="frequency" label="Frecuencia" validate={required()} />
                <TextInput source="tier" validate={required()} />
            </SimpleForm>
        </Edit>
    );
};

export const DonorCreate = () => {
    const redirect = useRedirect();
    const notify = useNotify();
    const refresh = useRefresh();

    const onSuccess = () => {
        notify('Donador creado correctamente'); // Mensaje de éxito
        redirect('/donors'); // Redirige a la lista de donadores
        refresh(); // Refresca la vista
    };

    return (
        <Create mutationOptions={{ onSuccess }}>
            <SimpleForm>
                <TextInput source="nombre" validate={required()} />
                <TextInput source="apellido" validate={required()} />
                <TextInput source="email" validate={[required(), emailValidator]} />
                <NumberInput 
                    source="donationsAmount" 
                    label="Cantidad donada" 
                    validate={[required(), donationsAmountValidator]} 
                />
                <TextInput source="telefono" validate={[required(), phoneValidator]} />
                <TextInput source="tier" validate={required()} />
            </SimpleForm>
        </Create>
    );
};
