import { Menu } from "react-admin";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";

export const MyMenu = () => (
  <Menu>
    <Menu.DashboardItem primaryText="Dashboard" leftIcon={<DashboardIcon />} />
    <Menu.Item to="/users" primaryText="Users" leftIcon={<PeopleIcon />} />
    <Menu.Item
      to="/settings"
      primaryText="Settings"
      leftIcon={<SettingsIcon />}
    />
    {/* Categories and Applications are hidden from here but accessible via routes */}
  </Menu>
);
