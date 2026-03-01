import type { ReactNode } from "react";
import {
  Layout as RALayout,
  CheckForApplicationUpdate,
  UserMenu,
  useTranslate,
  Logout,
  MenuItemLink,
} from "react-admin";
import { MyMenu } from "./Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { forwardRef } from "react";

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

export const Layout = ({ children }: { children: ReactNode }) => (
  <RALayout menu={MyMenu} userMenu={<MyUserMenu />}>
    {children}
    <CheckForApplicationUpdate />
  </RALayout>
);
