export const API = import.meta.env.VITE_API_URL;

export const getApiUrl = (path: string = "") => {
  // Prefer an explicit VITE_API_URL when provided (works for prod and preview).
  // Fall back to localhost in dev, otherwise use a same-origin relative path.
  const envApi = import.meta.env.VITE_API_URL;
  const isDev = import.meta.env.DEV;
  const baseUrl = envApi ? envApi : (isDev ? "http://localhost:3000" : "");

  // Ensure we don't have double slashes if path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
