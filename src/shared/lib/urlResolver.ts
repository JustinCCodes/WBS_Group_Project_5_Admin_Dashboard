// Configuration for Local Environment (Split Ports)
const LOCAL_CONFIG = {
  API_URL: "http://localhost:8000/api/v1",
  AUTH_URL: "http://localhost:8001/v1", // Local Auth Server is at /v1
};

// Configuration for Production (Vercel Monolith)
const PROD_CONFIG = {
  // Both API and Auth are handled by the same backend deployment
  API_URL: "https://justinccodes-portfolio-backend.vercel.app/api/v1",
  AUTH_URL: "https://justinccodes-portfolio-backend.vercel.app/api/v1", // Prod Auth is mounted at /api/v1/auth
};

// Helper to get the current mode
export type EnvMode = "local" | "production";

export const getEnvMode = (): EnvMode => {
  if (typeof window === "undefined") return "local";
  return (localStorage.getItem("admin_env_mode") as EnvMode) || "production";
};

export const setEnvMode = (mode: EnvMode) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("admin_env_mode", mode);
  window.location.reload(); // Forces reload to apply changes
};

// Resolves the backend URL based on current mode
export function resolveUrl(url: string): string {
  const mode = getEnvMode();
  const config = mode === "local" ? LOCAL_CONFIG : PROD_CONFIG;

  const { API_URL, AUTH_URL } = config;

  // Auth routes: /auth/... -> AUTH_URL/auth/...
  if (url.startsWith("/auth/")) {
    // Strip the leading /auth so we can append it cleanly
    const cleanUrl = url.replace(/^\/auth/, "");

    // Result:
    // Local: http://localhost:8001/v1/auth/login
    // Prod:  https://justinccodes-portfolio-backend.vercel.app/api/v1/auth/login
    return `${AUTH_URL}/auth${cleanUrl}`;
  }

  // API routes: /api/... -> API_URL/...
  if (url.startsWith("/api/")) {
    const cleanUrl = url.replace(/^\/api/, "");
    return `${API_URL}${cleanUrl}`;
  }

  // Default fallback
  return `${API_URL}${url}`;
}
