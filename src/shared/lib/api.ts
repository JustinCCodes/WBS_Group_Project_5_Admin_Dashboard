import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { resolveUrl } from "./urlResolver";
// Import getItem and setItem to handle token storage
import { getItem, setItem } from "./tauriKeystore";

// Internal function to parse ban info from error message
const parseBanInfo = (
  errorMessage: string
): { reason: string; until?: string } | null => {
  if (!errorMessage.includes("Account is banned")) {
    return null;
  }
  const reasonMatch = errorMessage.match(
    /Reason:\s*(.+?)(?:\s+Banned until:|$)/
  );
  const untilMatch = errorMessage.match(/Banned until:\s*(.+?)$/);
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

// Requests interceptor
api.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    config.url = resolveUrl(url);
    config.withCredentials = true;

    try {
      // Attach CSRF token
      const method = (config.method || "get").toLowerCase();
      if (["post", "put", "patch", "delete"].includes(method)) {
        if (typeof window !== "undefined") {
          const match = document.cookie.match(/(?:^|; )csrfToken=([^;]+)/);
          if (match && match[1]) {
            config.headers = config.headers || {};
            (config.headers as Record<string, string>)["X-CSRF-Token"] =
              decodeURIComponent(match[1]);
          }
        }
      }

      // Attach Access Token for Tauri
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

// Desktop access token support
let desktopAccessToken: string | null = null;

export const setDesktopAccessToken = (token: string | null) => {
  desktopAccessToken = token;
};

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!original) {
      return Promise.reject(error);
    }

    const status = (error.response && error.response.status) || 0;
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
        // Prepares refresh payload
        let refreshPayload = {};
        if (typeof window !== "undefined" && window.__TAURI__) {
          const storedRefreshToken = await getItem("refreshToken");
          if (!storedRefreshToken) {
            throw new Error("No refresh token available for desktop client");
          }
          refreshPayload = {
            grant_type: "desktop",
            refreshToken: storedRefreshToken,
          };
        }

        // Makes refresh call
        const refreshResponse = await api.post(
          "/auth/refresh",
          refreshPayload, // Send the payload
          {
            withCredentials: true,
            _retry: true,
          } as AxiosRequestConfig & { _retry?: boolean }
        );

        // Saves new tokens if rotated
        if (typeof window !== "undefined" && window.__TAURI__) {
          const { accessToken, refreshToken } = refreshResponse.data;
          if (accessToken) {
            setDesktopAccessToken(accessToken);
            await setItem("accessToken", accessToken);
            // Re attach new access token to original request
            original.headers = original.headers || {};
            (original.headers as Record<string, string>)[
              "Authorization"
            ] = `Bearer ${accessToken}`;
          }
          if (refreshToken) {
            await setItem("refreshToken", refreshToken);
          }
        }

        processQueue(null);
        return api(original); // Retry original request
      } catch (refreshError) {
        processQueue(refreshError);

        // If refresh fails clear tokens to force re login
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("user");
          window.localStorage.removeItem("accessToken");
          window.localStorage.removeItem("refreshToken"); // Clears failed token
          setDesktopAccessToken(null);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Proactive token refresh
export const proactiveRefresh = async (): Promise<boolean> => {
  try {
    // Prepares refresh payload
    let refreshPayload = {};
    if (typeof window !== "undefined" && window.__TAURI__) {
      const storedRefreshToken = await getItem("refreshToken");
      if (!storedRefreshToken) {
        console.warn("No refresh token for proactive refresh.");
        return false; // Can't refresh
      }
      refreshPayload = {
        grant_type: "desktop",
        refreshToken: storedRefreshToken,
      };
    }

    const refreshResponse = await api.post(
      "/auth/refresh",
      refreshPayload, // Send payload
      {
        withCredentials: true,
        _retry: true,
      } as AxiosRequestConfig & { _retry?: boolean }
    );

    // Save new tokens if rotated
    if (typeof window !== "undefined" && window.__TAURI__) {
      const { accessToken, refreshToken } = refreshResponse.data;
      if (accessToken) {
        setDesktopAccessToken(accessToken);
        await setItem("accessToken", accessToken);
      }
      if (refreshToken) {
        await setItem("refreshToken", refreshToken);
      }
    }

    return true;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Proactive refresh failed:", error);
    }
    // Clear tokens if proactive refresh fails
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      setDesktopAccessToken(null);
    }
    return false;
  }
};

export default api;
