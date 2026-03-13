import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  SelectInput,
  required,
  Button as RAButton,
  Toolbar,
  SaveButton,
  ExportButton,
  useListContext,
  SimpleList,
  useRefresh,
} from "react-admin";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
  Card,
  CardActionArea,
  Typography,
  useMediaQuery,
  Theme,
  Fab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import { useHeader } from "../components/HeaderContext";

interface Category {
  id: string;
  name?: string;
  description?: string;
  sortOrder?: number;
  applicationSortMode?: "ALPHABETICAL" | "CUSTOM";
}

const CategoryTitle = ({ record }: { record?: Category }) => {
  return <span>Category {record ? `"${record.name}"` : ""}</span>;
};

const MyToolbar = ({ onCancel }: { onCancel: () => void }) => (
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    <SaveButton />
    <RAButton label="Cancel" onClick={onCancel} />
  </Toolbar>
);

const CategoryGrid = () => {
  const { data, isLoading } = useListContext<Category>();
  const navigate = useNavigate();

  if (isLoading) return null;

  return (
    <Grid container spacing={2} sx={{ mt: 1, p: 1 }}>
      {data.map((record) => (
        <Grid key={record.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
              onClick={() => navigate(`/categories/${record.id}`)}
              sx={{ flexGrow: 1, display: "flex", alignItems: "center", p: 2 }}
            >
              <FolderIcon sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, lineHeight: 1.2 }}
                  noWrap
                >
                  {record.name}
                </Typography>
                {record.description && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block" }}
                    noWrap
                  >
                    {record.description}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  Order: {record.sortOrder} | {record.applicationSortMode}
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export const CategoryList = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("categoryViewMode") || "list",
  );

  const handleToggle = useCallback(() => {
    const newMode = viewMode === "list" ? "grid" : "list";
    setViewMode(newMode);
    localStorage.setItem("categoryViewMode", newMode);
  }, [viewMode]);

  const headerActions = useMemo(
    () => (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <ExportButton
          resource="categories"
          sx={{
            color: "white",
            "& .MuiSvgIcon-root": { color: "white" },
          }}
        />
      </Box>
    ),
    [],
  );

  const refresh = useRefresh();
  const { searchQuery } = useHeader({
    title: "Categories",
    actions: headerActions,
    showSearch: true,
    onRefresh: refresh,
    viewMode: viewMode as "list" | "grid",
    onToggleViewMode: handleToggle,
  });

  return (
    <Box sx={{ pb: 10 }}>
      <List
        sort={{ field: "sortOrder", order: "ASC" }}
        actions={false}
        filter={searchQuery ? { q: searchQuery } : {}}
        sx={{ mt: 2 }}
      >
        {viewMode === "list" ? (
          isSmall ? (
            <SimpleList
              primaryText={(record) => record.name}
              secondaryText={(record) => record.description}
              tertiaryText={(record) => record.applicationSortMode}
              linkType="edit"
              leftIcon={() => <FolderIcon />}
            />
          ) : (
            <Datagrid rowClick="edit">
              <TextField source="name" />
              <TextField source="sortOrder" />
              <TextField source="applicationSortMode" />
              <TextField source="description" />
            </Datagrid>
          )
        ) : (
          <CategoryGrid />
        )}
      </List>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => navigate("/categories/create")}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export const CategoryEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const handleClose = () => navigate("/");

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
        <CategoryTitle />
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Edit
          id={id}
          resource="categories"
          mutationOptions={{ onSuccess: handleClose }}
          actions={false}
          component="div"
          sx={{ "& .RaEdit-main": { mt: 0 } }}
        >
          <SimpleForm toolbar={<MyToolbar onCancel={handleClose} />}>
            <TextInput source="name" validate={required()} fullWidth />
            <SelectInput
              source="applicationSortMode"
              choices={[
                { id: "ALPHABETICAL", name: "Alphabetical" },
                { id: "CUSTOM", name: "Custom" },
              ]}
              defaultValue="ALPHABETICAL"
              fullWidth
            />
            <TextInput source="description" multiline fullWidth />
          </SimpleForm>
        </Edit>
      </DialogContent>
    </Dialog>
  );
};

export const CategoryCreate = () => {
  const navigate = useNavigate();
  const handleClose = () => navigate("/");

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
        <span>Create Category</span>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Create
          resource="categories"
          mutationOptions={{ onSuccess: handleClose }}
          actions={false}
          component="div"
          sx={{ "& .RaCreate-main": { mt: 0 } }}
        >
          <SimpleForm toolbar={<MyToolbar onCancel={handleClose} />}>
            <TextInput source="name" validate={required()} fullWidth />
            <SelectInput
              source="applicationSortMode"
              choices={[
                { id: "ALPHABETICAL", name: "Alphabetical" },
                { id: "CUSTOM", name: "Custom" },
              ]}
              defaultValue="ALPHABETICAL"
              fullWidth
            />
            <TextInput source="description" multiline fullWidth />
          </SimpleForm>
        </Create>
      </DialogContent>
    </Dialog>
  );
};
