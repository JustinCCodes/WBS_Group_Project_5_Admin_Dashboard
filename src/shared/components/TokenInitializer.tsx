"use client";

import { useEffect } from "react";
import { setDesktopAccessToken } from "@/src/shared/lib/api";
import { getValidAccessToken } from "@/src/shared/lib/tauriKeystore";

// Initializes and validates the desktop access token on app startup
export function TokenInitializer() {
  useEffect(() => {
    const initializeToken = async () => {
      try {
        // Get valid token (will automatically refresh if needed)
        const token = await getValidAccessToken();

        if (token) {
          // Sets the token in API client for subsequent requests
          setDesktopAccessToken(token);
          if (process.env.NODE_ENV === "development") {
            console.log("Desktop access token initialized successfully");
          }
        } else {
          if (process.env.NODE_ENV === "development") {
            console.warn("No valid desktop access token available");
          }
          // Token will be set by login flow when user logs in
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to initialize desktop token:", error);
        }
      }
    };

    // Only run in Tauri environment
    if (typeof window !== "undefined" && window.__TAURI__) {
      initializeToken();
    }
  }, []);

  // This component doesn't render anything
  return null;
}
