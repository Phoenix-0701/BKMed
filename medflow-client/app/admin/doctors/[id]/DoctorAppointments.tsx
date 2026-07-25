// app/admin/doctors/[id]/DoctorAppointments.tsx
import React from "react";
import { RecentAppointment } from "./types";

interface DoctorAppointmentsProps {
  appointments: RecentAppointment[];
}

export default function DoctorAppointments({ appointments }: DoctorAppointmentsProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
          📑 Lịch Sử Khám Gần Đây
        </h3>
        <button className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
          Xem tất cả
        </button>
      </div>

      <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800">
        {appointments.map((item) => (
          <div key={item.id} className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0">
            <div className="flex items-start gap-3">
              {/* Patient Avatar Circle */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-600 dark:bg-zinc-800 dark:text-zinc-300 text-xs">
                {item.patientInitials}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.patientName}
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  {item.reason}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    HOÀN THÀNH
                  </span>
                  {item.status === "FOLLOW_UP" && (
                    <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      THEO DÕI THÊM
                    </span>
                  )}
                </div>
              </div>
            </div>

            <span className="text-[11px] whitespace-nowrap text-gray-400">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}