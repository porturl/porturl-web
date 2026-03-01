import { AuthProviderProps } from "react-oidc-context";

export const oidcConfig: AuthProviderProps = {
  authority: "https://localhost:8443/realms/porturl-local",
  client_id: "porturl-web",
  redirect_uri: window.location.origin,
  scope: "openid profile email offline_access",
  automaticSilentRenew: true,
  extraQueryParams: {
    prompt: "none",
  },
  onSigninCallback: (_user: any): void => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};
