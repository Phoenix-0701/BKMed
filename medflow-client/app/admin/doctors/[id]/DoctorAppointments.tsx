// app/admin/doctors/AddDoctorModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export interface NewDoctorForm {
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  licenseNumber: string;
  yearsOfExperience: number;
  status: "ACTIVE" | "INACTIVE";
  bio: string;
}

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewDoctorForm) => Promise<void>;
}

export default function AddDoctorModal({
  isOpen,
  onClose,
  onSubmit,
}: AddDoctorModalProps) {
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewDoctorForm>({
    fullName: "",
    email: "",
    phone: "",
    specialty: "",
    licenseNumber: "",
    yearsOfExperience: 5,
    status: "ACTIVE",
    bio: "",
  });

  // Đảm bảo chỉ render khi đã ở phía Client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        specialty: "",
        licenseNumber: "",
        yearsOfExperience: 5,
        status: "ACTIVE",
        bio: "",
      });
      onClose();
    } catch (err) {
      console.error("Lỗi gửi form:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const modalContent = (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 999999 }}
      className="flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 overflow-hidden">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Thêm Bác sĩ Mới
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[75vh] overflow-y-auto p-6 flex flex-col gap-5">
            
            {/* Top Row: Avatar Upload + Full Name */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex flex-col items-center justify-center shrink-0">
                <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 transition-all">
                  <span className="text-2xl">📷</span>
                  <span className="mt-1 text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                    Tải ảnh lên
                  </span>
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>

              <div className="flex-1 w-full flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Họ và Tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ tên đầy đủ"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@vien.vn"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                      Số Điện Thoại <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Nhập số điện thoại"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-zinc-800 my-1" />

            {/* Row 2: Specialty & License */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Chuyên Khoa <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.specialty}
                  onChange={(e) =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white cursor-pointer"
                >
                  <option value="">Chọn chuyên khoa</option>
                  <option value="Cardiology (Tim mạch)">Cardiology (Tim mạch)</option>
                  <option value="Neurology (Thần kinh)">Neurology (Thần kinh)</option>
                  <option value="Dermatology (Da liễu)">Dermatology (Da liễu)</option>
                  <option value="Pediatrics (Nhi khoa)">Pediatrics (Nhi khoa)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Số Giấy Phép Hành Nghề <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập số GPHN"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseNumber: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            {/* Row 3: Experience & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Số Năm Kinh Nghiệm
                </label>
                <input
                  type="number"
                  placeholder="Vd: 10"
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearsOfExperience: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Trạng Thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "ACTIVE" | "INACTIVE",
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white cursor-pointer"
                >
                  <option value="ACTIVE">Đang Công Tác</option>
                  <option value="INACTIVE">Tạm Khóa / Nghỉ</option>
                </select>
              </div>
            </div>

            {/* Row 4: Bio */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Tiểu sử chuyên môn (Tùy chọn)
              </label>
              <textarea
                rows={3}
                placeholder="Nhập thêm thông tin chuyên môn hoặc ghi chú..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 bg-white p-3.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white resize-none"
              />
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-800 disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? "Đang lưu..." : "💾 Lưu thông tin"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );

  // Đẩy trực tiếp ra body của trình duyệt
  return createPortal(modalContent, document.body);
}