// app/admin/doctors/DoctorStats.tsx
import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  iconBg: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, iconBg, icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-zinc-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

interface DoctorStatsProps {
  totalDoctors: number;
  activeDoctors: number;
  newDoctors: number;
}

export default function DoctorStats({
  totalDoctors,
  activeDoctors,
  newDoctors,
}: DoctorStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Tổng số bác sĩ"
        value={totalDoctors}
        iconBg="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
      <StatCard
        title="Bác sĩ đang hoạt động"
        value={activeDoctors}
        iconBg="bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-400"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        title="Tài khoản mới tạo (Tháng này)"
        value={newDoctors}
        iconBg="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
        icon={
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        }
      />
    </div>
  );
}