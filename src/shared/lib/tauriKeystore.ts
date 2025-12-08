"use client";

import { isTokenExpired, isTokenValid } from "./tokenValidator";
import { proactiveRefresh } from "./api";

// Simple localStorage based token storage for Tauri desktop app
// In Tauri, localStorage is isolated per app and secure enough for desktop use
// Could migrate to @tauri-apps/plugin-store for encrypted storage but not needed I think

// Key for desktop access token
const DESKTOP_TOKEN_KEY = "desktop_access_token";

// Sets an item in localStorage
export async function setItem(key: string, value: string): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false;
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn("Failed to save item:", e);
    return false;
  }
}

// Gets an item from localStorage
export async function getItem(key: string): Promise<string | null> {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  } catch (e) {
    console.warn("Failed to get item:", e);
    return null;
  }
}

// Removes an item from localStorage
export async function removeItem(key: string): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false;
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn("Failed to remove item:", e);
    return false;
  }
}

// Gets a valid access token refreshing if needed
export async function getValidAccessToken(): Promise<string | null> {
  try {
    const token = await getItem("accessToken");

    // No token found
    if (!token) {
      if (process.env.NODE_ENV === "development") {
        console.warn("No access token found");
      }
      return null;
    }

    // Checks if token is valid
    if (!isTokenValid(token, true)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Access token is invalid or not admin");
      }
      await clearTokens();
      return null;
    }

    // Checks if token will expire soon (within 5 minutes)
    if (isTokenExpired(token, 300)) {
      if (process.env.NODE_ENV === "development") {
        console.log("Token expiring soon, attempting refresh...");
      }

      try {
        const refreshed = await proactiveRefresh();
        if (refreshed) {
          // Token refreshed successfully get new token
          const newToken = await getItem("accessToken");
          if (newToken && isTokenValid(newToken, true)) {
            return newToken;
          }
        }
      } catch (refreshError) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to refresh token:", refreshError);
        }
        await clearTokens();
        return null;
      }
    }

    return token;

    // Returns the valid token
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to get valid access token:", e);
    }
    return null;
  }
}

// Loads the desktop access token from localStorage
export async function loadDesktopToken(): Promise<string | null> {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(DESKTOP_TOKEN_KEY);
  } catch (e) {
    console.warn("Failed to load desktop token:", e);
    return null;
  }
}

// Clears all authentication tokens and user data
export async function clearTokens(): Promise<void> {
  try {
    await removeItem("accessToken");
    await removeItem("refreshToken");
    await removeItem("user");
    await removeItem(DESKTOP_TOKEN_KEY);
    if (process.env.NODE_ENV === "development") {
      console.log("All tokens cleared");
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to clear tokens:", e);
    }
  }
}

// Clears only the desktop access token
export async function clearDesktopToken(): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false;
    localStorage.removeItem(DESKTOP_TOKEN_KEY);
    return true;
  } catch (e) {
    console.warn("Failed to clear desktop token:", e);
    return false;
  }
}
