// app/doctor/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  patient: {
    fullName: string;
    gender?: string;
    dateOfBirth?: string;
  };
  notes?: string;
  triageSession?: {
    riskLevel?: string;
    summary?: string;
  };
  status: string;
}

export default function DoctorSchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy ngày hôm nay định dạng YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch(
        `http://localhost:4000/appointments/doctor-schedule?date=${todayStr}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error("Lỗi fetch lịch khám:", err);
    } finally {
      setLoading(false);
    }
  }, [todayStr]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // Thống kê nhanh
  const totalCount = appointments.length;
  const waitingCount = appointments.filter((a) => a.status === "CONFIRMED" || a.status === "PENDING").length;
  const aiWarningCount = appointments.filter((a) => a.triageSession?.riskLevel === "HIGH").length;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Danh sách lịch hẹn hôm nay
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Ngày: {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSchedule}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 cursor-pointer"
          >
            🔄 Tải lại
          </button>
        </div>
      </div>

      {/* 3 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
              Tổng số lịch hẹn
            </p>
            <h3 className="text-3xl font-black text-blue-900 dark:text-blue-400 mt-2">
              {totalCount}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-zinc-800" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
              Chờ khám
            </p>
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
              {waitingCount}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-zinc-800" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
              Cần lưu ý AI (Nguy cơ cao)
            </p>
            <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">
              {aiWarningCount}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-full bg-rose-50 dark:bg-zinc-800" />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50/80 px-6 py-3.5 text-xs font-bold text-gray-500 dark:bg-zinc-800/50 dark:text-zinc-400 border-b border-gray-100 dark:border-zinc-800">
          <div className="col-span-2">Giờ</div>
          <div className="col-span-4">Bệnh nhân</div>
          <div className="col-span-3">Thông tin</div>
          <div className="col-span-2">Phân loại AI</div>
          <div className="col-span-1 text-right">Trạng thái</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">
            Đang tải dữ liệu ca khám từ Server...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            Hôm nay không có lịch hẹn khám nào.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {appointments.map((item) => {
              const patientInitials = item.patient?.fullName
                ? item.patient.fullName.split(" ").slice(-2).map((n) => n[0]).join("")
                : "BN";

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer"
                >
                  <div className="col-span-2">
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      {item.startTime}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      đến {item.endTime}
                    </p>
                  </div>

                  <div className="col-span-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xs shadow-2xs">
                      {patientInitials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.patient?.fullName || "Bệnh nhân"}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.patient?.gender || "Nam"}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <p className="text-xs font-semibold text-gray-800 dark:text-zinc-200">
                      {item.notes || "Khám tổng quát"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${
                        item.triageSession?.riskLevel === "HIGH"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {item.triageSession?.summary || "Bình thường"}
                    </span>
                  </div>

                  <div className="col-span-1 text-right text-xs font-bold text-blue-600">
                    {item.status}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}