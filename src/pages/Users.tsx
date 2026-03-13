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
  SimpleList,
  useTranslate,
} from "react-admin";
import { Avatar, useMediaQuery, Theme, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useHeader } from "../components/HeaderContext";
import { useMemo } from "react";

interface User {
  id: string;
  email: string;
  avatarUrl?: string;
  providerUserId?: string;
}

const UserTitle = ({ record }: { record?: User }) => {
  const translate = useTranslate();
  return (
    <span>
      {translate("resources.users.name", { smart_count: 1 })}{" "}
      {record ? `"${record.email}"` : ""}
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
      alt={record.email}
      sx={{ width: 40, height: 40 }}
    >
      {record.email?.[0]}
    </Avatar>
  );
};

export const UserList = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const translate = useTranslate();
  const headerActions = useMemo(() => null, []);

  const { searchQuery } = useHeader({
    title: translate("pages.users"),
    actions: headerActions,
    showSearch: false,
  });

  return (
    <Box sx={{ pb: 10 }}>
      <List actions={false} filter={searchQuery ? { q: searchQuery } : {}}>
        {isSmall ? (
          <SimpleList
            primaryText={(record) => record.email}
            secondaryText={(record) => record.id}
            tertiaryText={(record) => record.providerUserId}
            linkType="edit"
            leftAvatar={(record) => (
              <Avatar src={record.avatarUrl} alt={record.email}>
                {record.email?.[0]}
              </Avatar>
            )}
          />
        ) : (
          <Datagrid rowClick="edit">
            <TextField
              source="id"
              label={translate("resources.users.fields.id")}
            />
            <AvatarField
              source="avatarUrl"
              label={translate("resources.users.fields.avatarUrl")}
            />
            <EmailField
              source="email"
              label={translate("resources.users.fields.email")}
            />
            <TextField
              source="providerUserId"
              label={translate("resources.users.fields.providerUserId")}
            />
          </Datagrid>
        )}
      </List>
    </Box>
  );
};

export const UserEdit = () => {
  const translate = useTranslate();
  return (
    <Edit title={<UserTitle />} actions={<EditActions />}>
      <SimpleForm>
        <TextInput
          source="id"
          label={translate("resources.users.fields.id")}
          disabled
        />
        <TextInput
          source="email"
          label={translate("resources.users.fields.email")}
          validate={required()}
        />
        <TextInput
          source="providerUserId"
          label={translate("resources.users.fields.providerUserId")}
          disabled
        />
      </SimpleForm>
    </Edit>
  );
};

export const UserCreate = () => {
  const translate = useTranslate();
  return (
    <Create actions={<EditActions />}>
      <SimpleForm>
        <TextInput
          source="email"
          label={translate("resources.users.fields.email")}
          validate={required()}
        />
        <TextInput
          source="providerUserId"
          label={translate("resources.users.fields.providerUserId")}
          validate={required()}
        />
      </SimpleForm>
    </Create>
  );
};
