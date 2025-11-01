"use client";

import { useState } from "react";
import api, { setDesktopAccessToken } from "@/src/shared/lib/api";
import { setItem } from "@/src/shared/lib/tauriKeystore";
import type { LoginResponse, UseLoginReturn } from "@/src/features/auth/types";

export function useLogin(): UseLoginReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login function with desktop grant_type
  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    // API call to login endpoint
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
        grant_type: "desktop",
      });

      // Handles response
      const { accessToken, user } = response.data;

      // Validates response
      if (!accessToken || !user) {
        throw new Error("Invalid response from server");
      }

      // Ensures user has admin role
      if (user.role !== "admin") {
        throw new Error("Access denied. Admin privileges required.");
      }

      // Stores token for Tauri app
      setDesktopAccessToken(accessToken);
      await setItem("accessToken", accessToken);
      await setItem("user", JSON.stringify(user));

      // Successful login
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
