"use client";

import { useState } from "react";
import api, { setDesktopAccessToken } from "@/src/shared/lib/api";
import { setItem } from "@/src/shared/lib/tauriKeystore";
import type { LoginResponse, UseLoginReturn } from "@/src/features/auth/types";

export function useLogin(): UseLoginReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    try {
      // Makes API call to login endpoint
      const response = await api.post<any>("/auth/login", {
        email,
        password,
        grant_type: "desktop",
      });

      // Extracts tokens and user from response
      const { accessToken, refreshToken, user } = response.data;

      if (!accessToken || !user) {
        throw new Error("Invalid response from server");
      }

      if (user.role !== "admin") {
        throw new Error("Access denied. Admin privileges required.");
      }

      setDesktopAccessToken(accessToken);
      await setItem("accessToken", accessToken);

      // Store refreshToken if provided
      if (refreshToken) {
        await setItem("refreshToken", refreshToken);
      }

      await setItem("user", JSON.stringify(user));
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
