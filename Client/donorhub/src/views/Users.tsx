import {List, required, SimpleList, Datagrid, TextField, EmailField, Filter, EditButton, Edit, SimpleForm, TextInput, ReferenceInput, Create, FilterProps} from "react-admin";
import {useMediaQuery, Theme} from "@mui/material";
import { Resource } from 'react-admin';

const UserFilter = (props: FilterProps) => (
    <Filter {...props}>
        <TextInput label="Search by name" source="name" alwaysOn />
    </Filter>
);

const UserList = () => {
    const isSmall = useMediaQuery<Theme> ((theme) => theme.breakpoints.down("sm"));
    return (
        <List >
            {isSmall ? (
                <SimpleList
                    primaryText = {(record) => record.name}
                    secondaryText = {(record) => record.username}
                    tertiaryText = {(record) => record.email}
                />
        ) : (
            <Datagrid>
                <TextField source = "id"/>
                <TextField source = "name"/>
                <TextField source = "username"/>
                <EmailField source = "email"/>
                <TextField source = "address.city"/>
                <TextField source = "phone"/>
                <TextField source = "website"/>
                <TextField source = "company.name"/>
                <EditButton/>           
            </Datagrid>
        )}
    </List>
);
}

const UserEdit = () => {
    return (
    <Edit>
        <SimpleForm>
            <TextInput source = "id" InputProps = {{disabled: true}}/>
            <TextInput source = "name"/>
            <TextInput source = "username"/>
            <TextInput source = "email"/>
            <TextInput source = "address.city"/>
            <TextInput source = "phone"/>
            <TextInput source = "website"/>
            <TextInput source = "company.name"/>
        </SimpleForm>    
    </Edit>
    )
}

const UserCreate = () => {
    return (
    <Create>
        <SimpleForm>
            <TextInput source = "id" validate = {[required()]}/>
            <TextInput source = "name"/>
            <TextInput source = "username"/>
            <TextInput source = "email"/>
            <TextInput source = "address.city"/>
            <TextInput source = "phone"/>
            <TextInput source = "website"/>
            <TextInput source = "company.name"/>
        </SimpleForm>
    </Create>    
    )
}

const Users = () => (
    <Resource name="users" list={UserList} create={UserCreate} edit={UserEdit} />
  );

  export default Users;