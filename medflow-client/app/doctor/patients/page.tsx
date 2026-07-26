// app/doctor/patients/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";

interface Patient {
  id: string;
  fullName: string;
  phone: string;
  gender?: string;
  createdAt: string;
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch("http://localhost:4000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const users = await res.json();
        const patientList = users.filter((u: { role: string }) => u.role === "PATIENT");
        setPatients(patientList);
      }
    } catch (err) {
      console.error("Lỗi fetch bệnh nhân:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Quản lý Bệnh nhân
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm theo Tên, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-xs text-gray-900 focus:border-blue-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white shadow-2xs"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="rounded-2xl border border-gray-200/80 bg-white shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden min-h-[400px]">
        <div className="grid grid-cols-12 bg-gray-50/80 px-6 py-3.5 text-xs font-bold text-gray-500 dark:bg-zinc-800/50 dark:text-zinc-400 border-b border-gray-100 dark:border-zinc-800">
          <div className="col-span-3">Mã BN</div>
          <div className="col-span-4">Họ tên</div>
          <div className="col-span-3">Số Điện Thoại</div>
          <div className="col-span-2">Ngày đăng ký</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">
            Đang kết nối danh sách bệnh nhân...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            Không tìm thấy bệnh nhân nào.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {filteredPatients.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <div className="col-span-3 text-xs text-gray-500 font-mono">
                  {p.id.substring(0, 8)}...
                </div>
                <div className="col-span-4 text-sm font-bold text-gray-900 dark:text-white">
                  {p.fullName || "Bệnh nhân"}
                </div>
                <div className="col-span-3 text-xs text-gray-600 dark:text-zinc-300">
                  {p.phone || "Chưa có SĐT"}
                </div>
                <div className="col-span-2 text-xs text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}