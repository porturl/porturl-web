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
} from "react-admin";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";

const CategoryTitle = ({ record }: any) => {
  return <span>Category {record ? `"${record.name}"` : ""}</span>;
};

const MyToolbar = ({ onCancel }: { onCancel: () => void }) => (
  <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    <SaveButton />
    <RAButton label="Cancel" onClick={onCancel} />
  </Toolbar>
);

export const CategoryList = () => (
  <List sort={{ field: "sortOrder", order: "ASC" }}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="sortOrder" />
      <TextField source="applicationSortMode" />
      <TextField source="description" />
    </Datagrid>
  </List>
);

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
