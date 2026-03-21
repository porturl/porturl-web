import { fetchUtils, DataProvider } from "react-admin";
import { openApiDataProvider } from "@api-platform/admin";
import simpleRestProvider from "ra-data-simple-rest";
import spec from "../openapi.yaml";

export const removeTrailingSlash = (url: string) => {
  if (url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
};

export default async (
  entrypoint: string,
  httpClient = fetchUtils.fetchJson,
): Promise<DataProvider> => {
  const apiUrl = new URL(entrypoint, window.location.href);
  const normalizedEntrypoint = removeTrailingSlash(apiUrl.toString());

  // We must provide an underlying REST provider to openApiDataProvider.
  // We use simpleRestProvider which is compatible with our backend's ReactAdminConfig.
  const baseDataProvider = await openApiDataProvider({
    entrypoint: normalizedEntrypoint,
    docEntrypoint: spec,
    httpClient,
    dataProvider: simpleRestProvider(normalizedEntrypoint, httpClient),
  });

  // We decorate the standard provider with our custom icon upload logic and extra methods
  return {
    ...baseDataProvider,
    update: async (resource, params) => {
      if (resource === "applications") {
        const data = { ...params.data };
        if (data.icon && data.icon.rawFile instanceof File) {
          const formData = new FormData();
          formData.append("file", data.icon.rawFile);
          const { json: imageJson } = await httpClient(
            `${normalizedEntrypoint}/images`,
            {
              method: "POST",
              body: formData,
            },
          );
          data.icon = imageJson.filename;
        }
        const applicationData = data as Record<string, unknown>;
        delete applicationData.id;
        delete applicationData.iconUrl;
        delete applicationData.isLinked;
        delete applicationData.createdBy;
        return baseDataProvider.update(resource, { ...params, data });
      }
      return baseDataProvider.update(resource, params);
    },
    create: async (resource, params) => {
      if (resource === "applications") {
        const data = { ...params.data };
        if (data.icon && data.icon.rawFile instanceof File) {
          const formData = new FormData();
          formData.append("file", data.icon.rawFile);
          const { json: imageJson } = await httpClient(
            `${normalizedEntrypoint}/images`,
            {
              method: "POST",
              body: formData,
            },
          );
          data.icon = imageJson.filename;
        }
        const applicationData = data as Record<string, unknown>;
        delete applicationData.id;
        delete applicationData.iconUrl;
        delete applicationData.isLinked;
        delete applicationData.createdBy;
        return baseDataProvider.create(resource, { ...params, data });
      }
      return baseDataProvider.create(resource, params);
    },
    // Custom non-CRUD methods
    exportData: async () => {
      const url = `${normalizedEntrypoint}/admin/export`;
      const { json } = await httpClient(url);
      return { data: json };
    },
    importData: async (params) => {
      const url = `${normalizedEntrypoint}/admin/import`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
      return { data: json };
    },
    scanRealmClients: async (params) => {
      const url = `${normalizedEntrypoint}/admin/realms/${params.realm}/clients`;
      const { json } = await httpClient(url);
      return { data: json };
    },
    listRealms: async () => {
      const url = `${normalizedEntrypoint}/admin/realms`;
      const { json } = await httpClient(url);
      return { data: json };
    },
    getApplicationRoles: async (id) => {
      const url = `${normalizedEntrypoint}/applications/${id}/roles`;
      const { json } = await httpClient(url);
      return { data: json };
    },
    findAllCategories: async () => {
      const url = `${normalizedEntrypoint}/categories`;
      const { json } = await httpClient(url);
      return { data: json };
    },
    reorderCategories: async (params) => {
      const url = `${normalizedEntrypoint}/categories/reorder`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
      return { data: json };
    },
    reorderApplicationsInCategory: async (id, applicationIds) => {
      const url = `${normalizedEntrypoint}/categories/${id}/applications/reorder`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(applicationIds),
      });
      return { data: json };
    },
    moveApplication: async (id, params) => {
      const url = `${normalizedEntrypoint}/applications/${id}/move`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(params),
      });
      return { data: json };
    },
    findApplicationsByCategory: async (id) => {
      const url = `${normalizedEntrypoint}/categories/${id}/applications`;
      const { json } = await httpClient(url);
      return { data: json };
    },
  } as DataProvider;
};
