import {List, required, SimpleList, Datagrid, TextField, NumberField, DateField, Filter, EditButton, Edit, SimpleForm, TextInput, NumberInput, DateInput, Create, FilterProps} from "react-admin";
import {useMediaQuery, Theme} from "@mui/material";

const DonationFilter = (props: FilterProps) => (
    <Filter {...props}>
        <TextInput label="Search by donor name" source="donorName" alwaysOn />
    </Filter>
);

export const DonationList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return (
        <List>
            {isSmall ? (
                <SimpleList
                    primaryText={(record) => record.donorName}
                    secondaryText={(record) => record.amount}
                    tertiaryText={(record) => record.date}
                />
            ) : (
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="donorName" />
                    <NumberField source="amount" />
                    <DateField source="date" />
                    <TextField source="message" />
                    <EditButton />
                </Datagrid>
            )}
        </List>
    );
}

export const DonationEdit = () => {
    return (
        <Edit>
            <SimpleForm>
                <TextInput source="id" InputProps={{ disabled: true }} />
                <TextInput source="donorName" />
                <NumberInput source="amount" />
                <DateInput source="date" />
                <TextInput source="message" />
            </SimpleForm>
        </Edit>
    )
}

export const DonationCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="id" validate={[required()]} />
                <TextInput source="donorName" />
                <NumberInput source="amount" />
                <DateInput source="date" />
                <TextInput source="message" />
            </SimpleForm>
        </Create>
    )
}
