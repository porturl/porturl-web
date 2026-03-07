import {
  List,
  Datagrid,
  TextField,
  EmailField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  required,
  useRecordContext,
  TopToolbar,
  Button as RAButton,
} from "react-admin";
import { Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  avatarUrl?: string;
  providerUserId?: string;
}

const UserTitle = ({ record }: { record?: User }) => {
  return <span>User {record ? `"${record.email}"` : ""}</span>;
};

const EditActions = () => {
  const navigate = useNavigate();
  return (
    <TopToolbar>
      <RAButton
        label="Back"
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIcon />}
      />
    </TopToolbar>
  );
};

const AvatarField = ({ source }: { source: string }) => {
  const record = useRecordContext<User>();
  if (!record) return null;
  return (
    <Avatar
      src={record[source as keyof User] as string}
      alt={record.email}
      sx={{ width: 40, height: 40 }}
    >
      {record.email?.[0]}
    </Avatar>
  );
};

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <AvatarField source="avatarUrl" />
      <EmailField source="email" />
      <TextField source="providerUserId" />
    </Datagrid>
  </List>
);

export const UserEdit = () => (
  <Edit title={<UserTitle />} actions={<EditActions />}>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="email" validate={required()} />
      <TextInput source="providerUserId" disabled />
    </SimpleForm>
  </Edit>
);

export const UserCreate = () => (
  <Create actions={<EditActions />}>
    <SimpleForm>
      <TextInput source="email" validate={required()} />
      <TextInput source="providerUserId" validate={required()} />
    </SimpleForm>
  </Create>
);
