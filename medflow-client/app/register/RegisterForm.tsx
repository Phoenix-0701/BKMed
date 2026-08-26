"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RegisterFormData, VerifyOtpFormData } from "./types";

interface RegisterFormProps {
  onRegisterSubmit: (data: RegisterFormData) => Promise<void>;
  onVerifySubmit: (data: VerifyOtpFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
  step: "REGISTER" | "VERIFY_OTP";
}

export default function RegisterForm({
  onRegisterSubmit,
  onVerifySubmit,
  loading,
  error,
  success,
  step,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
  });
  const [otpData, setOtpData] = useState<VerifyOtpFormData>({
    code: "",
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterSubmit(registerData);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifySubmit(otpData);
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      {/* Messages */}
      {error && (
        <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          ✅ {success}
        </div>
      )}

      {step === "REGISTER" && (
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Họ và tên
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">📝</span>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={registerData.fullName}
                onChange={(e) =>
                  setRegisterData({ ...registerData, fullName: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white dark:focus:border-blue-500 dark:focus:bg-zinc-900 dark:focus:ring-blue-500/20 dark:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#27272a_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white] min-h-[44px] transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">📧</span>
              <input
                type="email"
                required
                placeholder="patient@example.com"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white dark:focus:border-blue-500 dark:focus:bg-zinc-900 dark:focus:ring-blue-500/20 dark:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#27272a_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white] min-h-[44px] transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="**********"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-10 text-sm text-gray-900 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white dark:focus:border-blue-500 dark:focus:bg-zinc-900 dark:focus:ring-blue-500/20 dark:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#27272a_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white] min-h-[44px] transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full min-h-[48px] rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center"
          >
            {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
          </button>
        </form>
      )}

      {step === "VERIFY_OTP" && (
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="text-center mb-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Nhập mã xác nhận (OTP)
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Chúng tôi vừa gửi mã 6 số tới <b>{registerData.email}</b>
            </p>
          </div>

          <div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">💬</span>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otpData.code}
                onChange={(e) => setOtpData({ code: e.target.value })}
                className="w-full text-center tracking-[0.5em] font-mono rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-4 pr-4 text-lg text-gray-900 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white dark:focus:border-blue-500 dark:focus:bg-zinc-900 dark:focus:ring-blue-500/20 dark:[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_#27272a_inset] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:white] min-h-[44px] transition-all duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otpData.code.length !== 6}
            className="w-full min-h-[48px] rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center mt-2"
          >
            {loading ? "Đang kiểm tra..." : "Xác nhận & Hoàn tất"}
          </button>
        </form>
      )}
    </div>
  );
}
