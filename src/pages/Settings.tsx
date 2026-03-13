import {
  useDataProvider,
  useNotify,
  useSetLocale,
  useTranslate,
} from "react-admin";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import WarningIcon from "@mui/icons-material/Warning";
import LanguageIcon from "@mui/icons-material/Language";
import { useState, ChangeEvent } from "react";
import { useHeader } from "../components/HeaderContext";
import {
  getLanguageSetting,
  resolveLocale,
  availableLocales,
  getBrowserLocale,
} from "../i18n";

const Settings = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const setLocale = useSetLocale();
  const translate = useTranslate();
  const [loading, setLoading] = useState(false);
  const [languageSetting, setLanguageSetting] = useState(getLanguageSetting());

  useHeader({
    title: translate("pages.settings"),
    actions: null,
    showSearch: false,
  });

  const handleLanguageChange = (event: SelectChangeEvent) => {
    const newSetting = event.target.value;
    setLanguageSetting(newSetting);
    localStorage.setItem("ra-language", newSetting);
    setLocale(resolveLocale(newSetting));
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const { data } = await dataProvider.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "porturl_export.json";
      a.click();
      notify("ra.notification.updated", {
        type: "success",
        messageArgs: { smart_count: 1 },
      });
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
        notify("ra.notification.created", {
          type: "success",
          messageArgs: { smart_count: 1 },
        });
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
      <Card sx={{ maxWidth: 600, mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <LanguageIcon /> {translate("custom.language")}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <FormControl fullWidth size="small">
            <Select
              value={languageSetting}
              onChange={handleLanguageChange}
              displayEmpty
            >
              <MenuItem value="system">
                {translate("custom.system")} (
                {translate(`custom.${getBrowserLocale()}`)})
              </MenuItem>
              {availableLocales.map((l) => (
                <MenuItem key={l.locale} value={l.locale}>
                  {translate(`custom.${l.locale}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Card sx={{ maxWidth: 600, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {translate("custom.admin_operations")}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {translate("custom.export")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {translate("custom.export_description")}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
                disabled={loading}
              >
                {translate("custom.export")}
              </Button>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" gutterBottom color="error">
                {translate("custom.import")}
              </Typography>
              <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>
                {translate("custom.import_description")}
              </Alert>
              <Button
                variant="contained"
                color="error"
                startIcon={<FileUploadIcon />}
                component="label"
                disabled={loading}
              >
                {translate("custom.import")}
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
