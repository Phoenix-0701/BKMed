// app/doctor/settings/page.tsx
"use client";

import { useState } from "react";

export default function DoctorSettingsPage() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("11:00");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return alert("Vui lòng chọn ngày mở lịch!");

    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch("http://localhost:4000/availabilities/create-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          startTime,
          endTime,
          slotDuration: 30, // 30 phút mỗi ca khám
        }),
      });

      if (res.ok) {
        alert("Đã mở các ca khám thành công trên hệ thống!");
        setDate("");
      } else {
        const err = await res.json();
        alert(`Lỗi: ${err.message || "Không thể tạo lịch"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi kết nối máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Thiết lập Lịch trống khám bệnh
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
          Tạo các khung giờ khám mới để bệnh nhân đăng ký.
        </p>
      </div>

      <form
        onSubmit={handleCreateSchedule}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col gap-4"
      >
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
            Chọn Ngày Khám <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Giờ Bắt Đầu
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Giờ Kết Thúc
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-fit rounded-xl bg-blue-700 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-800 cursor-pointer disabled:opacity-50"
        >
          {submitting ? "Đang khởi tạo..." : "📅 Mở khung giờ khám"}
        </button>
      </form>
    </div>
  );
}