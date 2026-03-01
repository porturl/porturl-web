# porturl-web

## Installation

Install the application dependencies by running:

```sh
npm install
```

## Development

Start the application in development mode by running:

```sh
npm run dev
```

## Keycloak Setup

For the admin interface to authenticate with the backend, you need to configure a client in your Keycloak realm.

### Step 1: Create the Web Client
1.  **Client ID**: `porturl-web`
2.  **Client authentication**: `Off` (Public)
3.  **Standard flow**: `On`
4.  **Valid Redirect URIs**: `http://localhost:5173/*` (or your current web dev port)
5.  **Web Origins**: `http://localhost:5173` (allows CORS)

### Step 2: Configuration
Update `src/oidcConfig.ts` with your Keycloak URL and Realm:

```typescript
export const oidcConfig: AuthProviderProps = {
  authority: "https://your-keycloak:8443/realms/porturl-local",
  client_id: "porturl-web",
  redirect_uri: window.location.origin,
  // ...
};
```

## Production

Build the application in production mode by running:

```sh
npm run build
```
