import simpleRestProvider from "./services/restDataProvider";
import { useAuth } from "react-oidc-context";
import { useMemo, useCallback, useEffect, useState } from "react";
import {
  Admin,
  Resource,
  CustomRoutes,
  AuthProvider,
  fetchUtils,
  defaultTheme,
  DataProvider,
} from "react-admin";
import { Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import {
  ApplicationList,
  ApplicationEdit,
  ApplicationCreate,
} from "./pages/Applications";
import { CategoryList, CategoryEdit, CategoryCreate } from "./pages/Categories";
import { UserList, UserEdit, UserCreate } from "./pages/Users";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export const App = () => {
  const auth = useAuth();

  useEffect(() => {
    if (
      !auth.isLoading &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.error
    ) {
      auth.signinRedirect();
    }
  }, [
    auth.isLoading,
    auth.isAuthenticated,
    auth.activeNavigator,
    auth.error,
    auth.signinRedirect,
    auth,
  ]);

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

  const [dataProvider, setDataProvider] = useState<DataProvider | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      queueMicrotask(() => {
        setDataProvider((prev) => (prev !== null ? null : prev));
      });
      return;
    }

    if (dataProvider === null) {
      const apiUrl = window.env?.apiUrl || "http://localhost:8080/api";
      simpleRestProvider(apiUrl, httpClient).then((provider) => {
        setDataProvider(provider);
      });
    }
  }, [auth.isAuthenticated, httpClient, dataProvider]);
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
        <h1>Redirecting to login...</h1>
      </div>
    );
  }

  if (!dataProvider) return null;

  const theme = {
    ...defaultTheme,
    components: {
      ...defaultTheme.components,
      RaSidebar: {
        styleOverrides: {
          root: {
            "& .RaSidebar-fixed": {
              backgroundColor: "#f5f5f5",
            },
          },
        },
      },
      RaLayout: {
        styleOverrides: {
          root: {
            minWidth: 0,
            "& .RaLayout-appFrame": {
              minWidth: 0,
            },
            "& .RaLayout-content": {
              minWidth: 0,
            },
          },
        },
      },
    },
  };

  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      layout={Layout}
      theme={theme}
      disableTelemetry={true}
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
