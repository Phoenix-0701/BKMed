// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import { LoginFormData } from "./types";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.emailOrPhone,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Email hoặc mật khẩu không đúng.");
      }

      if (result.user?.isLocked) {
        throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.");
      }

      // Lưu Token & User Object vào LocalStorage
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Phân luồng theo Role[cite: 1]
      const userRole = result.user?.role;
      if (userRole === "ADMIN") {
        router.push("/admin/doctors");
      } else if (userRole === "DOCTOR") {
        router.push("/doctor/schedule");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Không thể kết nối đến máy chủ.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50/60 via-white to-blue-50/30 p-4 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg">
          🩺
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          MedFlow AI
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500 dark:text-zinc-400">
          Secure patient portal access
        </p>
      </div>

      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />

      <p className="mt-6 text-xs text-gray-600 dark:text-zinc-400">
        {"Don't have an account? "}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}