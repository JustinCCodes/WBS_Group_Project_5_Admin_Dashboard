import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { resolveUrl } from "./urlResolver";

// Internal function to parse ban info from error message
const parseBanInfo = (
  errorMessage: string
): { reason: string; until?: string } | null => {
  if (!errorMessage.includes("Account is banned")) {
    return null;
  }

  // Extract reason and until date using regex
  const reasonMatch = errorMessage.match(
    /Reason:\s*(.+?)(?:\s+Banned until:|$)/
  );

  // Extracts until date if present
  const untilMatch = errorMessage.match(/Banned until:\s*(.+?)$/);

  // Builds ban info object
  const reason = reasonMatch
    ? reasonMatch[1].trim()
    : "Your account has been banned.";
  const until = untilMatch ? untilMatch[1].trim() : undefined;

  return { reason, until };
};

// Global ban handler
let globalBanHandler:
  | ((banInfo: { reason: string; until?: string }) => void)
  | null = null;

// Function to set the global ban handler
export const setGlobalBanHandler = (
  handler: (banInfo: { reason: string; until?: string }) => void
) => {
  globalBanHandler = handler;
};

// Axios instance for admin API
// baseURL will be determined dynamically in request interceptor
const api: AxiosInstance = axios.create({
  withCredentials: true, // For sending cookies
  timeout: 30000, // 30 second timeout
});

// Interceptor to handle 401 responses and refresh token logic
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Processes the queued requests after token refresh
const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Requests interceptor to ensure credentials are always included
api.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    // Uses extracted URL resolver for cleaner testable URL resolution
    config.url = resolveUrl(url);

    // Ensures credentials are included in every request
    config.withCredentials = true;

    // Attach CSRF token for state changing requests (double-submit cookie pattern)
    try {
      // Only add to methods that modify state
      const method = (config.method || "get").toLowerCase();
      if (["post", "put", "patch", "delete"].includes(method)) {
        // Read csrfToken cookie (non-httpOnly cookie set by backend)
        if (typeof window !== "undefined") {
          const match = document.cookie.match(/(?:^|; )csrfToken=([^;]+)/);
          if (match && match[1]) {
            config.headers = config.headers || {};
            (config.headers as Record<string, string>)["X-CSRF-Token"] =
              decodeURIComponent(match[1]);
          }
        }
      }

      // Only send desktopAccessToken if running in Tauri (window.__TAURI__)
      if (
        desktopAccessToken &&
        typeof window !== "undefined" &&
        window.__TAURI__
      ) {
        config.headers = config.headers || {};
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${desktopAccessToken}`;
      }
    } catch (e) {
      // Do not block requests if reading cookies fails
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to attach CSRF or desktop token", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Desktop access token support (for Tauri desktop app)
let desktopAccessToken: string | null = null;

export const setDesktopAccessToken = (token: string | null) => {
  desktopAccessToken = token;
};

// Internal getter - not exported (only used within this module)
const getDesktopAccessToken = () => desktopAccessToken;

// Response interceptor to handle 401 errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // If no original request just reject
    if (!original) {
      return Promise.reject(error);
    }

    // Extracts status and request info
    const status = (error.response && error.response.status) || 0;
    const isAuthPath = Boolean(
      original.url && original.url.startsWith("/auth/")
    );
    const isRefreshCall = Boolean(
      original.url &&
        (original.url === "/auth/refresh" || original.url.endsWith("/refresh"))
    );

    // Checks for 403 ban status
    if (status === 403 && error.response?.data) {
      const errorData = error.response.data as { error?: string };
      if (errorData.error) {
        const banInfo = parseBanInfo(errorData.error);
        if (banInfo && globalBanHandler) {
          globalBanHandler(banInfo);
          return Promise.reject(error);
        }
      }
    }

    // Handle 401 Unauthorized - try to refresh token
    if (status === 401 && !original._retry && !isRefreshCall) {
      if (
        original.url?.includes("/auth/login") ||
        original.url?.includes("/auth/register") ||
        (original.url?.includes("/users") &&
          original.method?.toLowerCase() === "post")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queues this request to retry after refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            original._retry = true;
            return api(original);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        // Attempts to refresh the token
        await api.post("/auth/refresh", {}, {
          withCredentials: true,
          _retry: true, // Prevents infinite loop
        } as AxiosRequestConfig & { _retry?: boolean });

        processQueue(null); // Resolves all queued requests
        return api(original); // Retries the original request
      } catch (refreshError) {
        processQueue(refreshError); // Rejects all queued requests

        // If refresh fails, clear any stored client state and let
        // the application UI decide whether to navigate to /login.
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("user");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Proactive token refresh calls this periodically to refresh before expiry
export const proactiveRefresh = async (): Promise<boolean> => {
  try {
    await api.post("/auth/refresh", {}, {
      withCredentials: true,
      _retry: true,
    } as AxiosRequestConfig & { _retry?: boolean });
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Proactive refresh failed:", error);
    }
    return false;
  }
};

export default api;
