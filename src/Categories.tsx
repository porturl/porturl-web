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
  TopToolbar,
  Button as RAButton,
  Toolbar,
  SaveButton,
  ExportButton,
  CreateButton,
  useListContext,
} from "react-admin";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardActionArea,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import FolderIcon from "@mui/icons-material/Folder";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const CategoryTitle = ({ record }: any) => {
  return <span>Category {record ? `"${record.name}"` : ""}</span>;
};

const MyToolbar = ({ onCancel }: { onCancel: () => void }) => (
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    <SaveButton />
    <RAButton label="Cancel" onClick={onCancel} />
  </Toolbar>
);

const ListActions = ({ viewMode, onToggle }: any) => (
  <TopToolbar>
    <Tooltip title={viewMode === "list" ? "Switch to Grid View" : "Switch to List View"}>
      <IconButton onClick={onToggle}>
        {viewMode === "list" ? <GridViewIcon /> : <ViewListIcon />}
      </IconButton>
    </Tooltip>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const CategoryGrid = () => {
  const { data, isLoading } = useListContext();
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
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
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
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("categoryViewMode") || "list"
  );

  const handleToggle = () => {
    const newMode = viewMode === "list" ? "grid" : "list";
    setViewMode(newMode);
    localStorage.setItem("categoryViewMode", newMode);
  };

  return (
    <List
      sort={{ field: "sortOrder", order: "ASC" }}
      actions={<ListActions viewMode={viewMode} onToggle={handleToggle} />}
      sx={{ mt: 2 }}
    >
      {viewMode === "list" ? (
        <Datagrid rowClick="edit">
          <TextField source="name" />
          <TextField source="sortOrder" />
          <TextField source="applicationSortMode" />
          <TextField source="description" />
        </Datagrid>
      ) : (
        <CategoryGrid />
      )}
    </List>
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
