// URL Resolver for Admin Dashboard Tauri app Only

// Gets backend URLs from environment variables or defaults to localhost

function getBackendUrls(): { apiBaseUrl: string; authBaseUrl: string } {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
  const authUrl =
    process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8001/api/v1";

  return {
    apiBaseUrl: apiUrl,
    authBaseUrl: authUrl,
  };
}

// Resolves the backend URL for Tauri desktop app
export function resolveUrl(url: string): string {
  const { apiBaseUrl, authBaseUrl } = getBackendUrls();

  // Auth routes go to auth server (port 8001)
  // authBaseUrl already includes /api/v1 so need to strip /auth and re add it
  if (url.startsWith("/auth/")) {
    // Remove /auth prefix since authBaseUrl = "http://localhost:8001/api/v1"
    // Need: http://localhost:8001/api/v1/auth/login
    const cleanUrl = url.replace(/^\/auth/, "");
    return `${authBaseUrl}/auth${cleanUrl}`;
  }

  // API routes go to API server (port 8000) strip /api prefix
  if (url.startsWith("/api/")) {
    const cleanUrl = url.replace(/^\/api/, "");
    return `${apiBaseUrl}${cleanUrl}`;
  }

  // Default: unprefixed routes go to API server
  return `${apiBaseUrl}${url}`;
}
