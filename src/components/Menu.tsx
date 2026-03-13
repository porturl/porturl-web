import { Menu, useGetIdentity } from "react-admin";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import { Avatar, Box } from "@mui/material";

export const MyMenu = () => {
  const { data: identity } = useGetIdentity();

  return (
    <Menu
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100% - 16px)",
      }}
    >
      <Menu.DashboardItem
        primaryText="Dashboard"
        leftIcon={<DashboardIcon />}
      />
      <Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleIcon />} />
      <Menu.Item
        to="/settings"
        primaryText="Settings"
        leftIcon={<SettingsIcon />}
      />

      <Box sx={{ flexGrow: 1 }} />

      <Menu.Item
        to="/profile"
        primaryText={identity?.fullName || "Profile"}
        leftIcon={
          <Avatar
            src={identity?.avatar}
            sx={{
              width: 24,
              height: 24,
              fontSize: "0.75rem",
              bgcolor: "primary.main",
            }}
          >
            {identity?.fullName?.[0]}
          </Avatar>
        }
      />
    </Menu>
  );
};
