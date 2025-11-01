"use client";

import { useRouter } from "next/navigation";
import { useLogin } from "@/src/features/auth/hooks/useLogin";
import LoginForm from "@/src/features/auth/components/LoginForm";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, loading, error } = useLogin();

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    router.push("/dashboard");
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} error={error} />;
}
