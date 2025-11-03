"use client";

import React, { useState, FormEvent } from "react";
import Button from "@/src/shared/ui/Button";
import { useLogin } from "@/src/features/auth/hooks/useLogin";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const { login: secureLogin, loading, error: loginError } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  // Handles form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);

    try {
      // Uses secure login with desktop grant_type
      await secureLogin(email, password);

      setSuccess(`Login successful! Welcome!`);

      // Redirects to dashboard after successful login
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };
  return (
    <div className="min-h-screen  text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-8 shadow-xl">
          <h1 className="mb-8 text-center text-3xl font-bold">
            <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
              Login
            </span>
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                disabled={loading}
                placeholder="Enter your password"
              />
            </div>
            {loginError && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-400">{loginError}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
                <p className="text-sm text-green-400">{success}</p>
              </div>
            )}
            <Button type="submit" loading={loading} fullWidth>
              Login
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-amber-500 hover:text-amber-400 font-medium"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
