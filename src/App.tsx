import simpleRestProvider from "./restDataProvider";
import { useAuth } from "react-oidc-context";
import { useMemo, useCallback } from "react";
import {
  Admin,
  Resource,
  CustomRoutes,
  AuthProvider,
  fetchUtils,
} from "react-admin";
import { Route } from "react-router-dom";
import { Layout } from "./Layout";
import Dashboard from "./Dashboard";
import {
  ApplicationList,
  ApplicationEdit,
  ApplicationCreate,
} from "./Applications";
import { CategoryList, CategoryEdit, CategoryCreate } from "./Categories";
import { UserList, UserEdit, UserCreate } from "./Users";
import Profile from "./Profile";
import Settings from "./Settings";

export const App = () => {
  const auth = useAuth();

  const authProvider = useMemo<AuthProvider>(
    () => ({
      login: () => auth.signinRedirect(),
      logout: () => {
        auth.signoutRedirect();
        return Promise.resolve();
      },
      checkAuth: () =>
        auth.isAuthenticated ? Promise.resolve() : Promise.reject(),
      checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
          return Promise.reject();
        }
        return Promise.resolve();
      },
      getPermissions: () => Promise.resolve(),
      getIdentity: () => {
        if (!auth.user) return Promise.reject();
        return Promise.resolve({
          id: auth.user.profile.sub,
          fullName:
            auth.user.profile.preferred_username ||
            auth.user.profile.name ||
            auth.user.profile.email,
          avatar: auth.user.profile.picture,
        });
      },
    }),
    [auth],
  );

  const httpClient = useCallback(
    (url: string, options: fetchUtils.Options = {}) => {
      if (!options.headers) {
        options.headers = new Headers({ Accept: "application/json" });
      }
      const token = auth.user?.access_token;
      if (token) {
        (options.headers as Headers).set("Authorization", `Bearer ${token}`);
      }
      return fetchUtils.fetchJson(url, options);
    },
    [auth.user?.access_token],
  );

  const dataProvider = useMemo(() => {
    if (!auth.isAuthenticated) return null;
    const apiUrl = window.env?.apiUrl || "http://localhost:8080/api";
    return simpleRestProvider(apiUrl, httpClient);
  }, [auth.isAuthenticated, httpClient]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <h1>Welcome to PortUrl</h1>
        <button onClick={() => auth.signinRedirect()}>Log in</button>
      </div>
    );
  }

  if (!dataProvider) return null;

  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      layout={Layout}
    >
      <Resource name="applications" list={ApplicationList} />
      <Resource name="categories" list={CategoryList} />
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
      />
      <CustomRoutes>
        <Route path="/" element={<Dashboard />}>
          <Route path="applications/create" element={<ApplicationCreate />} />
          <Route path="applications/:id" element={<ApplicationEdit />} />
          <Route path="categories/create" element={<CategoryCreate />} />
          <Route path="categories/:id" element={<CategoryEdit />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </CustomRoutes>
    </Admin>
  );
};
