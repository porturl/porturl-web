/// <reference types="vite/client" />

interface Window {
  env: {
    apiUrl?: string;
    clientId?: string;
  };
}

declare module "*.yaml" {
  const content: Record<string, unknown>;
  export default content;
}

declare module "*.yml" {
  const content: Record<string, unknown>;
  export default content;
}
