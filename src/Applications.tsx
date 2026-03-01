import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  ReferenceArrayInput,
  SelectArrayInput,
  UrlField,
  required,
  useRecordContext,
  Button as RAButton,
  SaveButton,
  Toolbar,
  AutocompleteInput,
  useDataProvider,
} from "react-admin";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Chip,
  TextField as MuiTextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ImageEditor from "./ImageEditor";

const ApplicationTitle = ({ record }: any) => {
  return <span>Application {record ? `"${record.name}"` : ""}</span>;
};

const AvatarField = ({ source }: { source: string }) => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Avatar
      src={record[source]}
      alt={record.name}
      sx={{ width: 40, height: 40 }}
    >
      {record.name?.[0]}
    </Avatar>
  );
};

const RolesFields = ({ isLinked }: { isLinked: boolean }) => {
  const { setValue } = useFormContext();
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const availableRoles = useWatch({ name: "availableRoles" }) || [];
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    if (record?.id && isLinked) {
      dataProvider.getApplicationRoles(record.id).then(({ data }: any) => {
        setValue("availableRoles", data);
      });
    }
  }, [record?.id, isLinked, dataProvider, setValue]);

  const handleAddRole = () => {
    if (newRole && !availableRoles.includes(newRole)) {
      setValue("availableRoles", [...availableRoles, newRole]);
      setNewRole("");
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setValue(
      "availableRoles",
      availableRoles.filter((r: string) => r !== roleToRemove),
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="subtitle2"
        gutterBottom
        color={isLinked ? "textPrimary" : "textSecondary"}
      >
        Application Roles
      </Typography>
      {!isLinked && (
        <Typography
          variant="caption"
          color="error"
          display="block"
          sx={{ mb: 1 }}
        >
          Roles are only supported for linked applications.
        </Typography>
      )}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <MuiTextField
          size="small"
          label="New Role"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          disabled={!isLinked}
          fullWidth
        />
        <Button
          variant="outlined"
          onClick={handleAddRole}
          disabled={!isLinked || !newRole}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {availableRoles.map((role: string) => (
          <Chip
            key={role}
            label={role}
            onDelete={isLinked ? () => handleRemoveRole(role) : undefined}
            disabled={!isLinked}
          />
        ))}
      </Box>
    </Box>
  );
};

const KeycloakFields = () => {
  const dataProvider = useDataProvider();
  const { setValue } = useFormContext();
  const realm = useWatch({ name: "realm" });
  const clientId = useWatch({ name: "clientId" });
  const name = useWatch({ name: "name" });
  const [realms, setRealms] = useState<{ id: string; name: string }[]>([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingRealms, setIsLoadingRealms] = useState(false);
  const [isScanningClients, setIsScanningClients] = useState(false);

  useEffect(() => {
    setIsLoadingRealms(true);
    dataProvider
      .listRealms()
      .then(({ data }: any) => {
        setRealms(data.map((r: string) => ({ id: r, name: r })));
      })
      .finally(() => setIsLoadingRealms(false));
  }, [dataProvider]);

  useEffect(() => {
    if (realm) {
      setIsScanningClients(true);
      dataProvider
        .scanRealmClients({ realm })
        .then(({ data }: any) => {
          setClients(
            data.map((c: any) => ({
              id: c.clientId,
              name: c.name || c.clientId,
            })),
          );
        })
        .finally(() => setIsScanningClients(false));
    } else {
      setClients([]);
    }
  }, [realm, dataProvider]);

  const handleClientChange = (val: string) => {
    if (val && !name) {
      const client = clients.find((c) => c.id === val);
      if (client && client.name) {
        setValue("name", client.name);
      }
    }
  };

  const isLinked = realm && clientId && clients.some((c) => c.id === clientId);

  return (
    <Box
      sx={{
        mt: 2,
        mb: 2,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      <Box sx={{ typography: "subtitle2", mb: 2 }}>Keycloak Configuration</Box>
      <AutocompleteInput
        source="realm"
        choices={realms}
        fullWidth
        isLoading={isLoadingRealms}
      />
      <AutocompleteInput
        source="clientId"
        choices={clients}
        fullWidth
        disabled={!realm}
        isLoading={isScanningClients}
        onChange={handleClientChange}
      />
      <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 2 }}>
        <Box sx={{ typography: "body2", mr: 1 }}>Link Status:</Box>
        <Box
          sx={{
            typography: "body2",
            fontWeight: "bold",
            color: isLinked ? "success.main" : "error.main",
          }}
        >
          {isLinked ? "Linked" : "Not Linked"}
        </Box>
      </Box>
      <RolesFields isLinked={!!isLinked} />
    </Box>
  );
};

export const ApplicationList = () => (
  <List>
    <Datagrid rowClick="edit">
      <AvatarField source="iconUrl" />
      <TextField source="name" />
      <UrlField source="url" />
      <TextField source="clientId" />
      <TextField source="realm" />
    </Datagrid>
  </List>
);

const MyToolbar = ({ onCancel }: { onCancel: () => void }) => (
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    <SaveButton />
    <RAButton label="Cancel" onClick={onCancel} />
  </Toolbar>
);

export const ApplicationEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { refetch } = useOutletContext<{ refetch: () => void }>();
  const handleClose = () => {
    refetch();
    navigate("/");
  };

  return (
    <Dialog open={true} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ApplicationTitle />
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Edit
          id={id}
          resource="applications"
          mutationOptions={{ onSuccess: handleClose }}
          mutationMode="pessimistic"
          actions={false}
          component="div"
          sx={{ "& .RaEdit-main": { mt: 0 } }}
          transform={(data) => ({
            ...data,
            categories: data.categories?.map((id: any) =>
              typeof id === "object" ? id : { id },
            ),
            availableRoles: data.availableRoles,
          })}
        >
          <SimpleForm toolbar={<MyToolbar onCancel={handleClose} />}>
            <TextInput source="name" validate={required()} fullWidth />
            <TextInput
              source="url"
              validate={required()}
              type="url"
              fullWidth
            />
            <ImageEditor source="icon" label="Icon" />
            <KeycloakFields />
            <ReferenceArrayInput source="categories" reference="categories">
              <SelectArrayInput
                optionText="name"
                fullWidth
                format={(value: any[]) => value?.map((v) => v.id || v)}
              />
            </ReferenceArrayInput>
          </SimpleForm>
        </Edit>
      </DialogContent>
    </Dialog>
  );
};

export const ApplicationCreate = () => {
  const navigate = useNavigate();
  const { refetch } = useOutletContext<{ refetch: () => void }>();
  const handleClose = () => {
    refetch();
    navigate("/");
  };

  return (
    <Dialog open={true} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Create Application</span>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Create
          resource="applications"
          mutationOptions={{ onSuccess: handleClose }}
          mutationMode="pessimistic"
          actions={false}
          component="div"
          sx={{ "& .RaCreate-main": { mt: 0 } }}
          transform={(data) => ({
            ...data,
            categories: data.categories?.map((id: any) => ({ id })),
            roles: data.availableRoles,
          })}
        >
          <SimpleForm toolbar={<MyToolbar onCancel={handleClose} />}>
            <TextInput source="name" validate={required()} fullWidth />
            <TextInput
              source="url"
              validate={required()}
              type="url"
              fullWidth
            />
            <ImageEditor source="icon" label="Icon" />
            <KeycloakFields />
            <ReferenceArrayInput source="categories" reference="categories">
              <SelectArrayInput optionText="name" fullWidth />
            </ReferenceArrayInput>
          </SimpleForm>
        </Create>
      </DialogContent>
    </Dialog>
  );
};
