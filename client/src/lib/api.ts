export const API = import.meta.env.VITE_API_URL;

export const getApiUrl = (path: string = "") => {
  // If we are in production (or the same origin), return relative path
  // If we are in development, Vite serves on 5173 but API is on 3000
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev ? (import.meta.env.VITE_API_URL || "http://localhost:3000") : "";
  
  // Ensure we don't have double slashes if path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
