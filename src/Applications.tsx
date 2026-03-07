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
  TopToolbar,
  ExportButton,
  CreateButton,
  useListContext,
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
  Grid,
  Card,
  CardActionArea,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import ImageEditor from "./ImageEditor";

interface Application {
  id: string;
  name?: string;
  url?: string;
  iconUrl?: string;
  clientId?: string;
  realm?: string;
  availableRoles?: string[];
  categories?: { id: string; name?: string }[];
}

const ApplicationTitle = ({ record }: { record?: Application }) => {
  return <span>Application {record ? `"${record.name}"` : ""}</span>;
};

const AvatarField = ({ source }: { source: string }) => {
  const record = useRecordContext<Application>();
  if (!record) return null;
  return (
    <Avatar
      src={record[source as keyof Application] as string}
      alt={record.name}
      sx={{ width: 40, height: 40 }}
    >
      {record.name?.[0]}
    </Avatar>
  );
};

const RolesFields = ({ isLinked }: { isLinked: boolean }) => {
  const { setValue } = useFormContext();
  const record = useRecordContext<Application>();
  const dataProvider = useDataProvider();
  const availableRoles = useWatch({ name: "availableRoles" }) || [];
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    if (record?.id && isLinked) {
      dataProvider
        .getApplicationRoles(record.id)
        .then(({ data }: { data: string[] }) => {
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
      .then(({ data }: { data: string[] }) => {
        setRealms(data.map((r: string) => ({ id: r, name: r })));
      })
      .finally(() => setIsLoadingRealms(false));
  }, [dataProvider]);

  useEffect(() => {
    if (realm) {
      setIsScanningClients(true);
      dataProvider
        .scanRealmClients({ realm })
        .then(({ data }: { data: { clientId: string; name?: string }[] }) => {
          setClients(
            data.map((c: { clientId: string; name?: string }) => ({
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

const ListActions = ({
  viewMode,
  onToggle,
}: {
  viewMode: string;
  onToggle: () => void;
}) => (
  <TopToolbar>
    <Tooltip
      title={
        viewMode === "list" ? "Switch to Grid View" : "Switch to List View"
      }
    >
      <IconButton onClick={onToggle}>
        {viewMode === "list" ? <GridViewIcon /> : <ViewListIcon />}
      </IconButton>
    </Tooltip>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const ApplicationGrid = () => {
  const { data, isLoading } = useListContext<Application>();
  const navigate = useNavigate();

  if (isLoading) return null;

  return (
    <Grid container spacing={2} sx={{ mt: 1, p: 1 }}>
      {data.map((record) => (
        <Grid item key={record.id} xs={12} sm={6} md={4} lg={3}>
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.2s ease-in-out",
              borderRadius: 2,
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardActionArea
              onClick={() => navigate(`/applications/${record.id}`)}
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                textAlign: "center",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={record.iconUrl}
                  alt={record.name}
                  sx={{
                    width: 64,
                    height: 64,
                    mb: 1,
                    bgcolor: "grey.100",
                    color: "text.primary",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {record.name?.[0]}
                </Avatar>
                {(record.realm || record.clientId) && (
                  <Tooltip title="Linked to Keycloak">
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: -4,
                        bgcolor: "primary.main",
                        color: "white",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid white",
                        boxShadow: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: "bold", fontSize: 10 }}
                      >
                        K
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
              </Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, lineHeight: 1.2, mt: 1 }}
                noWrap
              >
                {record.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
                noWrap
              >
                {record.url ? new URL(record.url).hostname : ""}
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export const ApplicationList = () => {
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("applicationViewMode") || "list",
  );

  const handleToggle = () => {
    const newMode = viewMode === "list" ? "grid" : "list";
    setViewMode(newMode);
    localStorage.setItem("applicationViewMode", newMode);
  };

  return (
    <List
      actions={<ListActions viewMode={viewMode} onToggle={handleToggle} />}
      sx={{ mt: 2 }}
    >
      {viewMode === "list" ? (
        <Datagrid rowClick="edit">
          <AvatarField source="iconUrl" />
          <TextField source="name" />
          <UrlField source="url" />
          <TextField source="clientId" />
          <TextField source="realm" />
        </Datagrid>
      ) : (
        <ApplicationGrid />
      )}
    </List>
  );
};

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
          transform={(data: Application) => ({
            ...data,
            categories: data.categories?.map((id: string | { id: string }) =>
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
                format={(value: (string | { id: string })[]) =>
                  value?.map((v) => (typeof v === "object" ? v.id : v))
                }
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
          transform={(data: Application) => ({
            ...data,
            categories: data.categories?.map((id: string | { id: string }) =>
              typeof id === "object" ? id : { id },
            ),
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
