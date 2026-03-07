import { AuthProviderProps } from "react-oidc-context";

export const getOidcConfig = (
  authority: string,
  clientId: string,
): AuthProviderProps => ({
  authority,
  client_id: clientId,
  redirect_uri: window.location.origin,
  scope: "openid profile email offline_access",
  automaticSilentRenew: true,
  onSigninCallback: (_user: any): void => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
});
