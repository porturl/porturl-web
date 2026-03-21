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
  minLength,
  useRecordContext,
  TopToolbar,
  Button as RAButton,
  SimpleList,
  useTranslate,
  CreateButton,
  DeleteButton,
  useGetIdentity,
} from "react-admin";
import { Avatar, useMediaQuery, Theme, Box, IconButton, Fab } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import { useHeader } from "../components/HeaderContext";
import { useMemo } from "react";

interface User {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  providerUserId?: string;
}

const UserTitle = ({ record }: { record?: User }) => {
  const translate = useTranslate();
  console.log("UserEdit record:", record);
  return (
    <span>
      {translate("resources.users.name", { smart_count: 1 })}{" "}
      {record ? `"${record.username}"` : ""}
    </span>
  );
};

const EditActions = () => {
  const navigate = useNavigate();
  const translate = useTranslate();
  return (
    <TopToolbar>
      <RAButton
        label={translate("custom.back")}
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
      alt={record.username}
      sx={{ width: 40, height: 40 }}
    >
      {record.username?.[0]}
    </Avatar>
  );
};

const DeleteUserButton = (props: any) => {
  const record = useRecordContext<User>();
  const { data: identity } = useGetIdentity();

  if (!record || !identity || record.providerUserId === identity.id) {
    return <Box sx={{ width: 80 }} />;
  }

  return <DeleteButton mutationMode="pessimistic" {...props} />;
};

export const UserList = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const translate = useTranslate();
  const navigate = useNavigate();

  const { searchQuery } = useHeader({
    title: translate("pages.users"),
    actions: null,
    showSearch: true,
  });

  return (
    <Box sx={{ pb: 10, pt: 2, position: "relative", minHeight: "80vh" }}>
      <List
        actions={false}
        filter={searchQuery ? { q: searchQuery } : {}}
        sort={{ field: "id", order: "ASC" }}
      >
        {isSmall ? (
          <SimpleList
            primaryText={(record) => record.username}
            secondaryText={(record) => record.email || record.id}
            tertiaryText={(record) => record.providerUserId}
            linkType="edit"
            leftAvatar={(record) => (
              <Avatar src={record.avatarUrl} alt={record.username}>
                {record.username?.[0]}
              </Avatar>
            )}
            rowSecondaryAction={<DeleteUserButton />}
          />
        ) : (
          <Datagrid rowClick="edit" bulkActionButtons={false}>
            <TextField
              source="id"
              label={translate("resources.users.fields.id")}
            />
            <AvatarField
              source="avatarUrl"
              label={translate("resources.users.fields.avatarUrl")}
            />
            <TextField
              source="username"
              label={translate("resources.users.fields.username")}
            />
            <EmailField
              source="email"
              label={translate("resources.users.fields.email")}
            />
            <TextField
              source="providerUserId"
              label={translate("resources.users.fields.providerUserId")}
            />
            <DeleteUserButton />
          </Datagrid>
        )}
      </List>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => navigate("/users/create")}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export const UserEdit = () => {
  const { id } = useParams();
  const translate = useTranslate();

  useHeader({
    title: translate("resources.users.name", { smart_count: 1 }),
    showSearch: false,
  });

  return (
    <Box sx={{ pt: 2 }}>
      <Edit
        id={id}
        mutationMode="pessimistic"
        title={<UserTitle />}
        actions={<EditActions />}
      >
        <UserForm />
      </Edit>
    </Box>
  );
};

const UserForm = () => {
  const translate = useTranslate();
  const record = useRecordContext<User>();
  console.log("UserForm record:", record);

  return (
    <SimpleForm>
      <TextInput
        source="id"
        label={translate("resources.users.fields.id")}
        disabled
      />
      <TextInput
        source="username"
        label={translate("resources.users.fields.username")}
        validate={[required(), minLength(3)]}
      />
      <TextInput
        source="email"
        label={translate("resources.users.fields.email")}
      />
      <TextInput
        source="providerUserId"
        label={translate("resources.users.fields.providerUserId")}
        disabled
      />
    </SimpleForm>
  );
};

export const UserCreate = () => {
  const translate = useTranslate();

  useHeader({
    title: translate("custom.create_user"),
    showSearch: false,
  });

  return (
    <Box sx={{ pt: 2 }}>
      <Create actions={<EditActions />}>
        <SimpleForm>
          <TextInput
            source="username"
            label={translate("resources.users.fields.username")}
            validate={[required(), minLength(3)]}
          />
          <TextInput
            source="email"
            label={translate("resources.users.fields.email")}
          />
        </SimpleForm>
      </Create>
    </Box>
  );
};
