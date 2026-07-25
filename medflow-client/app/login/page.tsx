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
      // Thay đổi URL API auth của backend bạn ở đây (Ví dụ: /auth/login)
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
        throw new Error(result.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }

      // 1. Lưu JWT Token vào LocalStorage
      localStorage.setItem("accessToken", result.accessToken);

      // 2. Phân luồng chuyển hướng dựa theo Role từ JWT/Response
      const role = result.user?.role;
      if (role === "ADMIN") {
        router.push("/admin/doctors");
      } else if (role === "DOCTOR") {
        router.push("/doctor/schedule");
      } else {
        router.push("/"); // Bệnh nhân về trang chủ
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi kết nối với máy chủ.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50/60 via-white to-blue-50/30 p-4 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      
      {/* App Logo & Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        {/* Placeholder Icon */}
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl dark:bg-blue-950">
          🩺
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          MedFlow AI
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500 dark:text-zinc-400">
          Secure patient portal access
        </p>
      </div>

      {/* Login Card Form */}
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />

      {/* Footer Register Link */}
      <p className="mt-6 text-xs text-gray-600 dark:text-zinc-400">
        Don't have an account?{" "}
        <Link href="/register" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
          Register here
        </Link>
      </p>

    </div>
  );
}