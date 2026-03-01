// import { stringify } from 'query-string';
import { fetchUtils, DataProvider } from "react-admin";

export const removeTrailingSlash = (url: string) => {
  if (url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
};

// Based on @api-platform/admin/lib/dataProvider/restDataProvider.js
export default (
  entrypoint: string,
  httpClient = fetchUtils.fetchJson,
): DataProvider => {
  const apiUrl = new URL(entrypoint, window.location.href);
  return {
    getList: async (resource, params) => {
      const { page, perPage } = params.pagination ?? { page: 1, perPage: 25 };
      const { field, order } = params.sort ?? { field: "id", order: "DESC" };
      const rangeStart = (page - 1) * perPage;
      const rangeEnd = page * perPage - 1;
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([rangeStart, rangeEnd]),
        filter: JSON.stringify(params.filter),
      };
      const url = `${removeTrailingSlash(apiUrl.toString())}/${resource}?${new URLSearchParams(query).toString()}`;
      const { json } = await httpClient(url);
      return {
        data: json,
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: page > 1,
        },
      };
    },
    getOne: async (resource, params) => {
      const url = `${removeTrailingSlash(apiUrl.toString())}/${resource}/${params.id}`;
      const { json } = await httpClient(url);
      return {
        data: json,
      };
    },
    getMany: async (resource, params) => {
      const query = {
        filter: JSON.stringify({ id: params.ids }),
      };
      const url = `${removeTrailingSlash(apiUrl.toString())}/${resource}?${new URLSearchParams(query).toString()}`;
      const { json } = await httpClient(url);
      return {
        data: json,
      };
    },
    getManyReference: async (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const rangeStart = (page - 1) * perPage;
      const rangeEnd = page * perPage - 1;
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([rangeStart, rangeEnd]),
        filter: JSON.stringify({
          ...params.filter,
          [params.target]: params.id,
        }),
      };
      const url = `${removeTrailingSlash(apiUrl.toString())}/${resource}?${new URLSearchParams(query).toString()}`;
      const { json } = await httpClient(url);
      return {
        data: json,
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: page > 1,
        },
      };
    },
    update: async (resource, params) => {
      const data = { ...params.data };
      if (resource === "applications") {
        if (data.icon && data.icon.rawFile instanceof File) {
          const formData = new FormData();
          formData.append("file", data.icon.rawFile);
          const { json: imageJson } = await httpClient(
            `${removeTrailingSlash(apiUrl.toString())}/images`,
            {
              method: "POST",
              body: formData,
            },
          );
          data.icon = imageJson.filename;
        }
        delete (data as any).id;
        delete (data as any).iconUrl;
        delete (data as any).isLinked;
        delete (data as any).createdBy;
      }

      const url = `${removeTrailingSlash(apiUrl.toString())}/${resource}/${params.id}`;
      const { json } = await httpClient(url, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return {
        data: json,
      };
    },
    updateMany: async (resource, params) => {
      const responses = await Promise.all(
        params.ids.map(async (id) => {
          const data = { ...params.data };
          if (resource === "applications") {
            // Normally icon uploads in updateMany are rare, but for completeness:
            if (data.icon && data.icon.rawFile instanceof File) {
              const formData = new FormData();
              formData.append("file", data.icon.rawFile);
              const { json: imageJson } = await httpClient(
                `${removeTrailingSlash(apiUrl.toString())}/images`,
                {
                  method: "POST",
                  body: formData,
                },
              );
              data.icon = imageJson.filename;
            }
            delete (data as any).id;
            delete (data as any).iconUrl;
            delete (data as any).isLinked;
            delete (data as any).createdBy;
          }
          const url = `${removeTrailingSlash(apiUrl.toString())}/${resource}/${id}`;
          return httpClient(url, {
            method: "PUT",
            body: JSON.stringify(data),
          });
        }),
      );
      return { data: responses.map(({ json }) => json.id) };
    },
    create: async (resource, params) => {
      const data = { ...params.data };
      if (resource === "applications") {
        if (data.icon && data.icon.rawFile instanceof File) {
          const formData = new FormData();
          formData.append("file", data.icon.rawFile);
          const { json: imageJson } = await httpClient(
            `${removeTrailingSlash(apiUrl.toString())}/images`,
            {
              method: "POST",
              body: formData,
            },
          );
          data.icon = imageJson.filename;
        }
        delete (data as any).id;
        delete (data as any).iconUrl;
        delete (data as any).isLinked;
        delete (data as any).createdBy;
      }

      const url = `${removeTrailingSlash(apiUrl.toString())}/${resource}`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return {
        data: json,
      };
    },
    delete: async (resource, params) => {
      const url = `${removeTrailingSlash(apiUrl.toString())}/${resource}/${params.id}`;
      const { json } = await httpClient(url, {
        method: "DELETE",
      });
      return {
        data: json,
      };
    },
    deleteMany: async (resource, params) => {
      const responses = await Promise.all(
        params.ids.map((id) => {
          const url = `${removeTrailingSlash(apiUrl.toString())}/${resource}/${id}`;
          return httpClient(url, {
            method: "DELETE",
          });
        }),
      );
      return {
        data: responses.map(({ json }) => json.id),
      };
    },
    exportData: async () => {
      const url = `${removeTrailingSlash(apiUrl.toString())}/admin/export`;
      const { json } = await httpClient(url);
      return { data: json };
    },
    importData: async (params) => {
      const url = `${removeTrailingSlash(apiUrl.toString())}/admin/import`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
      return { data: json };
    },
    scanRealmClients: async (params) => {
      const url = `${removeTrailingSlash(apiUrl.toString())}/admin/realms/${params.realm}/clients`;
      const { json } = await httpClient(url);
      return { data: json };
    },
    listRealms: async () => {
      const url = `${removeTrailingSlash(apiUrl.toString())}/admin/realms`;
      const { json } = await httpClient(url);
      return { data: json };
    },
    getApplicationRoles: async (id) => {
      const url = `${removeTrailingSlash(apiUrl.toString())}/applications/${id}/roles`;
      const { json } = await httpClient(url);
      return { data: json };
    },
    reorderCategories: async (params) => {
      const url = `${removeTrailingSlash(apiUrl.toString())}/categories/reorder`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
      return { data: json };
    },
    reorderApplications: async (params) => {
      const url = `${removeTrailingSlash(apiUrl.toString())}/applications/reorder`;
      const { json } = await httpClient(url, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
      return { data: json };
    },
  };
};
