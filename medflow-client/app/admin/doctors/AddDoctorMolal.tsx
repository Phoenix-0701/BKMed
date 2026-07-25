// app/admin/doctors/AddDoctorModal.tsx
"use client";

import React, { useState } from "react";
import { DoctorFormData } from "./types";

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorFormData) => Promise<void>;
}

export default function AddDoctorModal({
  isOpen,
  onClose,
  onSubmit,
}: AddDoctorModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<DoctorFormData>({
    fullName: "",
    email: "",
    phone: "",
    specialty: "Cardiology (Tim mạch)",
    department: "Khoa Nội",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(formData);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4 backdrop-blur-xs">
      {/* Tối ưu Mobile: Hiển thị dạng Bottom Sheet trên Mobile, Modal ở Desktop */}
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Thêm Bác sĩ Mới
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              required
              placeholder="Dr. Nguyen Van A"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Email nội bộ
            </label>
            <input
              type="email"
              required
              placeholder="doctor@hospital.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              required
              placeholder="0901234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Chuyên khoa
              </label>
              <input
                type="text"
                required
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Phòng / Khoa
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white min-h-[44px]"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-300 min-h-[44px]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 min-h-[44px]"
            >
              {submitting ? "Đang xử lý..." : "Tạo Bác Sĩ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}