import type { ReactNode } from "react";
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  UserMenu,
  Logout,
  MenuItemLink,
  Sidebar,
  AppBar,
  SidebarProps,
} from "react-admin";
import { MyMenu } from "./Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

const MyUserMenu = () => {
  return (
    <UserMenu>
      <MenuItemLink
        to="/profile"
        primaryText="Profile"
        leftIcon={<PersonIcon />}
      />
      <MenuItemLink
        to="/settings"
        primaryText="Settings"
        leftIcon={<SettingsIcon />}
      />
      <Logout />
    </UserMenu>
  );
};

const MyAppBar = () => <AppBar userMenu={<MyUserMenu />} />;

const MySidebar = (props: SidebarProps) => (
  <Sidebar {...props} size={240} closedSize={50} />
);

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout menu={MyMenu} appBar={MyAppBar} sidebar={MySidebar}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
