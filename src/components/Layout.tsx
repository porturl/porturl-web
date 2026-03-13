import type { ReactNode } from "react";
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  Sidebar,
  AppBar,
  SidebarProps,
  useTranslate,
} from "react-admin";
import { MyMenu } from "./Menu";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RefreshIcon from "@mui/icons-material/Refresh";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { HeaderProvider, useHeader } from "./HeaderContext";

const MyAppBarContent = () => {
  const translate = useTranslate();
  const {
    actions,
    searchQuery,
    setSearchQuery,
    showSearch,
    onRefresh,
    viewMode,
    onToggleViewMode,
  } = useHeader();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 2,
        height: 48, // Fixed height
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          justifyContent: "flex-end",
          flexGrow: 1, // Let it take the remaining space
          minWidth: 0,
        }}
      >
        {showSearch && (
          <TextField
            size="small"
            variant="outlined"
            placeholder={translate("ra.action.search") + "..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: 1,
              width: { xs: "100%", sm: 300, md: 400 },
              flexShrink: 0,
              "& .MuiInputBase-root": {
                color: "white",
                height: 32,
                fontSize: "0.875rem",
                paddingLeft: "8px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiInputBase-input": {
                padding: "0 8px",
                height: "100%",
                "&::placeholder": {
                  color: "rgba(255, 255, 255, 0.7)",
                  opacity: 1,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mt: 0 }}>
                  <SearchIcon sx={{ color: "white", fontSize: 18 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                      sx={{
                        color: "white",
                        p: 0.25,
                        visibility: searchQuery ? "visible" : "hidden",
                        pointerEvents: searchQuery ? "auto" : "none",
                      }}
                    >
                      <ClearIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    {onRefresh && (
                      <Tooltip title={translate("ra.action.refresh")}>
                        <IconButton
                          size="small"
                          onClick={onRefresh}
                          sx={{ color: "white", p: 0.25 }}
                        >
                          <RefreshIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onToggleViewMode && (
                      <Tooltip
                        title={
                          viewMode === "list"
                            ? translate("ra.action.show_grid")
                            : translate("ra.action.show_list")
                        }
                      >
                        <IconButton
                          size="small"
                          onClick={onToggleViewMode}
                          sx={{ color: "white", p: 0.25 }}
                        >
                          {viewMode === "list" ? (
                            <GridViewIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <ViewListIcon sx={{ fontSize: 16 }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        )}
        <Box
          sx={{ display: "flex", gap: 1, alignItems: "center", flexShrink: 0 }}
        >
          {actions}
        </Box>
      </Box>
    </Box>
  );
};

const MyAppBar = () => (
  <AppBar userMenu={false} toolbar={<></>}>
    <MyAppBarContent />
  </AppBar>
);

const MySidebar = (props: SidebarProps) => (
  <Sidebar {...props} size={240} closedSize={50} />
);

export const Layout = ({ children }: { children: ReactNode }) => (
  <HeaderProvider>
    <RALayout menu={MyMenu} appBar={MyAppBar} sidebar={MySidebar}>
      {children}
      <CheckForApplicationUpdate />
    </RALayout>
  </HeaderProvider>
);
