// app/admin/doctors/[id]/DoctorStatsCards.tsx
import React from "react";

interface DoctorStatsCardsProps {
  totalPatients: number;
  yearsOfExperience: number;
}

export default function DoctorStatsCards({
  totalPatients,
  yearsOfExperience,
}: DoctorStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Thẻ Bệnh Nhân */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
            Tổng Bệnh Nhân
          </p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
            {totalPatients.toLocaleString("vi-VN")}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            ↗ +12% so với tháng trước
          </p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 rounded-lg">
          👥
        </div>
      </div>

      {/* Thẻ Kinh Nghiệm */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
            Số năm kinh nghiệm
          </p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
            {yearsOfExperience} năm
          </p>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Kinh nghiệm lâm sàng chuyên sâu
          </p>
        </div>
        <div className="p-3 bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 rounded-lg">
          💼
        </div>
      </div>
    </div>
  );
}