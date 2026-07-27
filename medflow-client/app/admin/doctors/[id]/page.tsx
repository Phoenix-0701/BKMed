// app/admin/doctors/[id]/page.tsx
"use client";

import { useEffect, useState, use, useCallback } from "react";
import DoctorHeaderCard from "./DoctorHeaderCard";
import DoctorStatsCards from "./DoctorStatsCards";
import DoctorBioAndCert from "./DoctorBioAndCert";
import DoctorAppointments from "./DoctorAppointments";
import { DoctorDetail, RecentAppointment } from "./types";

export default function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const doctorId = resolvedParams.id;

  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [appointments, setAppointments] = useState<RecentAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Chi tiết Hồ sơ Bác sĩ từ Server
  const fetchDoctorDetail = useCallback(async () => {
    try {
      // Gọi API Public Doctor Profile
      const res = await fetch(`http://localhost:4000/users/public/doctors/${doctorId}`);
      if (!res.ok) throw new Error("Không thể tải thông tin bác sĩ");

      const data = await res.json();

      // Mapping dữ liệu API trả về sang cấu trúc DoctorDetail của Client
      const mappedDoctor: DoctorDetail = {
        id: data.id || doctorId,
        fullName: data.user?.fullName || "Chưa cập nhật",
        title: `${data.specialty || "Bác sĩ"} - ${data.department || "Khoa khám"}`,
        email: data.user?.email || "Chưa cập nhật",
        phone: data.user?.phone || "Chưa cập nhật",
        docCode: `DOC-${doctorId.slice(0, 4).toUpperCase()}`,
        status: data.user?.isLocked ? "INACTIVE" : "ACTIVE",
        avatar: data.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=250",
        totalPatients: data._count?.appointments || 0,
        yearsOfExperience: data.experienceYears || 5, // Tự động hiển thị nếu có trong DB
        bio: data.bio || `Bác sĩ ${data.user?.fullName} chuyên khoa ${data.specialty}. Tốt nghiệp chuyên ngành Y khoa và có nhiều năm kinh nghiệm khám chữa bệnh lâm sàng.`,
        education: [
          {
            degree: `Bác sĩ Chuyên khoa ${data.specialty || "Đa khoa"}`,
            institution: "Đại học Y Dược TP.HCM",
            period: "2012 - 2018",
          },
        ],
      };

      setDoctor(mappedDoctor);
    } catch (err: unknown) {
      console.error("Lỗi fetch chi tiết bác sĩ:", err);
      setError("Không tìm thấy thông tin bác sĩ này.");
    }
  }, [doctorId]);

  // 2. Fetch Lịch khám gần đây của Bác sĩ
  const fetchDoctorAppointments = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Gọi API lấy danh sách ca khám (truyền ID hoặc lấy lịch gần nhất)
      const res = await fetch(`http://localhost:4000/appointments/doctor-schedule`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        // Mapping danh sách ca khám
        const mappedList: RecentAppointment[] = data.map((item: {
          id: string;
          patientProfile?: { user?: { fullName?: string } };
          createdAt?: string;
          notes?: string;
          status?: "COMPLETED" | "FOLLOW_UP" | "CANCELLED";
        }) => {
          const patientName = item.patientProfile?.user?.fullName || "Bệnh nhân";
          const initials = patientName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(-2)
            .toUpperCase();

          return {
            id: item.id,
            patientName: patientName,
            patientInitials: initials || "BN",
            time: item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "Hôm nay",
            reason: item.notes || "Khám bệnh định kỳ",
            status: item.status || "COMPLETED",
          };
        });

        setAppointments(mappedList);
      }
    } catch (err) {
      console.error("Lỗi fetch lịch hẹn:", err);
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchDoctorDetail(), fetchDoctorAppointments()]);
      setLoading(false);
    };

    loadAllData();
  }, [fetchDoctorDetail, fetchDoctorAppointments]);

  // 3. Gọi API Toggle Lock (Khóa / Mở khóa tài khoản)
  const handleToggleLock = async () => {
    if (!doctor) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:4000/admin/users/${doctorId}/toggle-lock`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setDoctor((prev) =>
          prev
            ? {
                ...prev,
                status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
              }
            : null
        );
      } else {
        alert("Thao tác thất bại. Vui lòng kiểm tra quyền Admin.");
      }
    } catch (err) {
      console.error("Lỗi khóa tài khoản:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8 text-center text-sm text-gray-500 dark:text-zinc-400">
        Đang tải thông tin bác sĩ từ hệ thống...
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <p className="text-base font-semibold text-rose-600">{error || "Không tìm thấy bác sĩ"}</p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 max-w-7xl mx-auto">
      {/* 1. Header Card */}
      <DoctorHeaderCard doctor={doctor} onToggleLock={handleToggleLock} />

      {/* 2. Grid Content Layout (Mobile: 1 Cột, Desktop: 2 Cột) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái: Thống kê + Tiểu sử + Đào tạo */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <DoctorStatsCards
            totalPatients={doctor.totalPatients}
            yearsOfExperience={doctor.yearsOfExperience}
          />
          <DoctorBioAndCert bio={doctor.bio} education={doctor.education} />
        </div>

        {/* Cột phải: Lịch sử khám gần đây */}
        <div className="lg:col-span-5">
          <DoctorAppointments appointments={appointments} />
        </div>
      </div>
    </div>
  );
}