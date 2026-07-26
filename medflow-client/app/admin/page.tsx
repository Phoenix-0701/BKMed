// app/admin/page.tsx
"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bảng Điều Khiển Quản Trị (Dashboard)
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Tổng quan hoạt động và vận hành của hệ thống MedFlow AI.
        </p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/admin/doctors"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs hover:border-blue-500 hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="text-3xl mb-3">🏥</div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Quản lý Bác sĩ
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Xem danh sách, phân khoa, tạo tài khoản và khóa tài khoản bác sĩ.
          </p>
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 opacity-80">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Quản lý Bệnh nhân
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Tra cứu thông tin bệnh nhân và lịch sử đăng ký khám bệnh.
          </p>
        </div>

        <Link
          href="/admin/settings"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs hover:border-blue-500 hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="text-3xl mb-3">⚙️</div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Cài đặt Hệ thống
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Cấu hình thời gian làm việc, danh mục chuyên khoa và thông số AI.
          </p>
        </Link>
      </div>
    </div>
  );
}