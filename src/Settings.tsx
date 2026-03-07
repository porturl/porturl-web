import { useDataProvider, useNotify, Title } from "react-admin";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import WarningIcon from "@mui/icons-material/Warning";
import { useState, ChangeEvent } from "react";

const Settings = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // openApiDataProvider should have these custom methods if doc suggests,
      // otherwise we might need to use fetch directly or define them in dataProvider
      // For now we assume we can call them via dataProvider if they are in the OpenAPI spec
      // or we use a more generic approach.
      const { data } = await dataProvider.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "porturl_export.json";
      a.click();
      notify("Export successful", { type: "success" });
    } catch (e: unknown) {
      notify(`Export failed: ${e instanceof Error ? e.message : String(e)}`, {
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = JSON.parse(e.target?.result as string);
        await dataProvider.importData({ data: content });
        notify("Import successful", { type: "success" });
      };
      reader.readAsText(file);
    } catch (e: unknown) {
      notify(`Import failed: ${e instanceof Error ? e.message : String(e)}`, {
        type: "error",
      });
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Title title="Settings" />
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Card sx={{ maxWidth: 600, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Admin Operations
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Export Data
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Download all applications and categories as a JSON file.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
                disabled={loading}
              >
                Export
              </Button>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" gutterBottom color="error">
                Import Data
              </Typography>
              <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>
                Importing data will overwrite existing applications and
                categories.
              </Alert>
              <Button
                variant="contained"
                color="error"
                startIcon={<FileUploadIcon />}
                component="label"
                disabled={loading}
              >
                Import
                <input
                  type="file"
                  hidden
                  accept=".json"
                  onChange={handleImport}
                />
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
