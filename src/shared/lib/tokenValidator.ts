"use client";

import { JWTPayload } from "@/src/types/types";

// Decodes a JWT token without verification client side only
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // Basic JWT structure check
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decodes payload
    const payload = parts[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return decoded as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Checks if a JWT token is expired

export function isTokenExpired(
  token: string,
  bufferSeconds: number = 300 // default 5 minutes buffer
  // Returns true if token is expired or will expire within bufferSeconds
): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  // Current time in seconds
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp - now < bufferSeconds;
}

// Gets the remaining time until token expiry in seconds
export function getTokenTimeRemaining(token: string): number {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return 0;

  const now = Math.floor(Date.now() / 1000);
  const remaining = decoded.exp - now;
  return remaining > 0 ? remaining : 0;
}

// Validates if a token is valid and not expired
export function isTokenValid(
  token: string | null | undefined,
  requireAdmin: boolean = true
  // Returns true if token is valid and not expired
): boolean {
  if (!token) return false;

  // Decodes token
  const decoded = decodeJWT(token);
  if (!decoded) return false;

  // Checks expiry
  if (isTokenExpired(token, 0)) return false;

  // Checks admin role if required
  if (requireAdmin && decoded.role !== "admin") return false;

  return true;
}
