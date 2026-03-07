import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";
import { App } from "./App";
import { getOidcConfig } from "./services/oidcConfig";

const Root = () => {
  const [oidcConfig, setOidcConfig] = useState<AuthProviderProps | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const apiUrl = window.env?.apiUrl || "http://localhost:8080/api";
      const clientId = window.env?.clientId || "porturl-web";

      try {
        const backendBaseUrl = apiUrl.endsWith("/api")
          ? apiUrl.substring(0, apiUrl.length - 4)
          : apiUrl;
        const response = await fetch(`${backendBaseUrl}/actuator/info`);
        if (!response.ok) {
          throw new Error(`Failed to fetch config: ${response.statusText}`);
        }
        const data = await response.json();
        const authority = data.auth?.["issuer-uri"];

        if (!authority) {
          throw new Error("OIDC Authority not found in backend configuration");
        }

        setOidcConfig(getOidcConfig(authority, clientId));
      } catch (err: unknown) {
        console.error("Error fetching runtime configuration:", err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchConfig();
  }, []);

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <h1>Configuration Error</h1>
        <p>{error}</p>
        <p>Please ensure the backend is running and accessible.</p>
      </div>
    );
  }

  if (!oidcConfig) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <h1>Loading Configuration...</h1>
      </div>
    );
  }

  return (
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
