// app/admin/doctors/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import DoctorStats from "./DoctorStats";
import DoctorTable from "./DoctorTable";
import AddDoctorModal from "./AddDoctorMolal";
import { Doctor, DoctorFormData } from "./types";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy danh sách bác sĩ từ API /admin/users[cite: 2]
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken"); // Hoặc lấy từ Cookie / Context

      const res = await fetch("http://localhost:4000/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const users = await res.json();
        // Lọc danh sách chỉ lấy Bác sĩ
        const doctorList = users
          .filter((u: { role: string }) => u.role === "DOCTOR")
          .map((u: { id: string; fullName: string; email: string; phone: string; doctorProfile?: { specialty: string; department: string }; isLocked: boolean }) => ({
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            phone: u.phone,
            specialty: u.doctorProfile?.specialty || "Chưa cập nhật",
            department: u.doctorProfile?.department || "Chưa cập nhật",
            status: u.isLocked ? "INACTIVE" : "ACTIVE",
          }));
        setDoctors(doctorList);
      }
    } catch (err) {
      console.error("Lỗi kết nối API:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Gọi API POST /admin/doctors[cite: 2]
  const handleAddDoctor = async (formData: DoctorFormData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:4000/admin/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Khởi tạo tài khoản Bác sĩ thành công!");
        fetchDoctors(); // Tải lại danh sách
      } else {
        const errData = await res.json();
        alert(`Lỗi: ${errData.message || "Không thể tạo tài khoản"}`);
      }
    } catch (err) {
      console.error("Lỗi khi thêm bác sĩ:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-8">
      {/* Header Page - Mobile Adaptive */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Quản lý Tài khoản Bác sĩ
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 sm:text-sm">
            Manage active clinicians and add new medical staff.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto min-h-[44px]"
        >
          <span>+</span> Thêm Bác sĩ Mới
        </button>
      </div>

      {/* Thống kê */}
      <DoctorStats
        totalDoctors={doctors.length}
        activeDoctors={doctors.filter((d) => d.status === "ACTIVE").length}
        newDoctors={doctors.length}
      />

      {/* Bảng danh sách */}
      {loading ? (
        <div className="p-8 text-center text-sm text-gray-500">Đang tải dữ liệu từ Server...</div>
      ) : (
        <DoctorTable doctors={doctors} />
      )}

      {/* Popup Modal */}
      <AddDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDoctor}
      />
    </div>
  );
}