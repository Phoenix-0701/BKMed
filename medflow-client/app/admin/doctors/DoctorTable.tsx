// app/admin/doctors/DoctorTable.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Doctor } from "./types";

interface DoctorTableProps {
  doctors: Doctor[];
  onToggleLock?: (doctorId: string) => void;
}

export default function DoctorTable({ doctors, onToggleLock }: DoctorTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header & Search Bar */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Danh sách Bác sĩ
        </h2>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên, email, chuyên khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white min-h-[40px]"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase dark:bg-zinc-800/50 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-3">Bác sĩ</th>
              <th className="px-6 py-3">Chuyên khoa & Khoa</th>
              <th className="px-6 py-3">Số điện thoại</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            {filteredDoctors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-zinc-400">
                  Không tìm thấy bác sĩ nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredDoctors.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  {/* Cột Bác sĩ */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          doc.avatar ||
                          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"
                        }
                        alt={doc.fullName || "Doctor Avatar"}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-zinc-700"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {doc.fullName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-zinc-400">
                          {doc.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cột Chuyên khoa */}
                  <td className="px-6 py-4 text-gray-700 dark:text-zinc-300">
                    <div className="font-medium">{doc.specialty}</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">
                      {doc.department}
                    </div>
                  </td>

                  {/* Cột Số điện thoại */}
                  <td className="px-6 py-4 text-gray-500 dark:text-zinc-400">
                    {doc.phone || "—"}
                  </td>

                  {/* Cột Trạng thái */}
                  <td className="px-6 py-4">
                    {doc.status === "ACTIVE" ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        • ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        • LOCKED
                      </span>
                    )}
                  </td>

                  {/* Cột Thao tác */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-500">
                      <button
                        title="Chỉnh sửa"
                        className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        title={doc.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}
                        onClick={() => onToggleLock && onToggleLock(doc.id)}
                        className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        {doc.status === "ACTIVE" ? "🔒" : "🔓"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}