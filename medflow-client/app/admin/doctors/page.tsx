// app/admin/doctors/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import DoctorStats from "./DoctorStats";
import DoctorTable from "./DoctorTable";
import AddDoctorModal, { NewDoctorForm } from "./AddDoctorMolal";
import { Doctor } from "./types";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Fetch danh sách Bác sĩ từ Server API
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const res = await fetch("http://localhost:4000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const users = await res.json();
        const doctorList = users
          .filter((u: { role: string }) => u.role === "DOCTOR")
          .map((u: { id: string; fullName: string; email: string; phone: string; doctorProfile?: { specialty: string; department: string; licenseNumber: string }; isLocked: boolean }) => ({
            id: u.id,
            fullName: u.fullName || "Bác sĩ",
            email: u.email,
            phone: u.phone || "Chưa cập nhật",
            specialty: u.doctorProfile?.specialty || "Tổng quát",
            department: u.doctorProfile?.department || "Chưa phân khoa",
            licenseNumber: u.doctorProfile?.licenseNumber || "MED-2026-VN",
            status: u.isLocked ? "INACTIVE" : "ACTIVE",
          }));
        setDoctors(doctorList);
      }
    } catch (err) {
      console.error("Lỗi fetch danh sách bác sĩ:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // 2. Xử lý Thêm Bác Sĩ Mới từ Modal
  const handleAddDoctor = async (formData: NewDoctorForm) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      // Gọi API thêm bác sĩ của NestJS
      const res = await fetch("http://localhost:4000/admin/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          specialty: formData.specialty,
          licenseNumber: formData.licenseNumber,
          experienceYears: formData.yearsOfExperience,
          bio: formData.bio,
          password: "DoctorPassword123@", // Mật khẩu mặc định khởi tạo
        }),
      });

      if (res.ok) {
        showToast("Đã thêm bác sĩ mới thành công vào hệ thống!");
        fetchDoctors(); // Cập nhật lại danh sách tự động
      } else {
        const errData = await res.json();
        alert(`Lỗi: ${errData.message || "Không thể tạo tài khoản bác sĩ"}`);
      }
    } catch (err) {
      console.error("Lỗi thêm bác sĩ:", err);
      alert("Đã xảy ra lỗi kết nối với máy chủ.");
    }
  };

  // 3. Khóa / Mở khóa tài khoản
  const handleToggleLock = async (doctorId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:4000/admin/users/${doctorId}/toggle-lock`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        showToast("Đã thay đổi trạng thái tài khoản!");
        fetchDoctors();
      }
    } catch (err) {
      console.error("Lỗi toggle lock:", err);
    }
  };

  return (
    <div className="relative flex flex-col gap-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[10000] rounded-xl bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-bounce">
          ✓ {toastMessage}
        </div>
      )}

      {/* Header Page */}
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
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-800 min-h-[44px] cursor-pointer"
        >
          <span>+</span> Thêm Bác sĩ Mới
        </button>
      </div>

      {/* Stats Section */}
      <DoctorStats
        totalDoctors={doctors.length}
        activeDoctors={doctors.filter((d) => d.status === "ACTIVE").length}
        newDoctors={doctors.length}
      />

      {/* Doctor Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-gray-500">
          Đang tải danh sách bác sĩ...
        </div>
      ) : (
        <DoctorTable doctors={doctors} onToggleLock={handleToggleLock} />
      )}

      {/* Add Doctor Popup Modal */}
      <AddDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDoctor}
      />
    </div>
  );
}