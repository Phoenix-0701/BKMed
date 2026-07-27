// app/admin/doctors/[id]/DoctorHeaderCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { DoctorDetail } from "./types";

interface DoctorHeaderCardProps {
  doctor: DoctorDetail;
  onToggleLock: () => void;
}

export default function DoctorHeaderCard({ doctor, onToggleLock }: DoctorHeaderCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Nút Quay lại */}
      <Link
        href="/admin/doctors"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors w-fit"
      >
        ← Quay lại danh sách
      </Link>

      {/* Main Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Image
              src={doctor.avatar}
              alt={doctor.fullName}
              width={100}
              height={100}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-2 border-gray-100 dark:border-zinc-800"
            />
            
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {doctor.fullName}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    doctor.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                  }`}
                >
                  • {doctor.status === "ACTIVE" ? "Đang hoạt động" : "Bị khóa"}
                </span>
              </div>

              <p className="text-sm font-semibold text-gray-600 dark:text-zinc-300">
                {doctor.title}
              </p>

              {/* Badges: ID, Email, Phone */}
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-zinc-400 mt-1">
                <span className="rounded-md bg-gray-100 px-2.5 py-1 dark:bg-zinc-800">
                  🪪 ID: {doctor.docCode}
                </span>
                <span className="rounded-md bg-gray-100 px-2.5 py-1 dark:bg-zinc-800">
                  ✉️ {doctor.email}
                </span>
                <span className="rounded-md bg-gray-100 px-2.5 py-1 dark:bg-zinc-800">
                  📞 {doctor.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            <button className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 w-full sm:w-auto">
              ✏️ Chỉnh sửa
            </button>
            <button
              onClick={onToggleLock}
              className="flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 w-full sm:w-auto"
            >
              {doctor.status === "ACTIVE" ? "🔒 Khóa tài khoản" : "🔓 Mở khóa"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}