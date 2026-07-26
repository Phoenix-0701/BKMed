// app/doctor/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DoctorSidebar() {
  const pathname = usePathname();
  const [doctorInfo, setDoctorInfo] = useState<{ fullName: string; specialty: string }>({
    fullName: "Dr. Nguyen Van A",
    specialty: "Tiêu hóa",
  });

  useEffect(() => {
    // Lấy thông tin Doctor từ LocalStorage nếu có
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setDoctorInfo({
          fullName: u.fullName || "Dr. Nguyen Van A",
          specialty: u.doctorProfile?.specialty || "Nội khoa",
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const navItems = [
    { name: "Lịch khám", href: "/doctor", icon: "📅" },
    { name: "Bệnh nhân", href: "/doctor/patients", icon: "👥" },
    { name: "Cài đặt", href: "/doctor/settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 min-h-screen p-5 flex flex-col justify-between">
      <div>
        {/* Brand Logo */}
        <div className="mb-8 px-2">
          <Link href="/doctor" className="text-xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
            <span>🩺</span> Medical Portal
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/doctor"
                ? pathname === "/doctor"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all min-h-[46px] ${
                  isActive
                    ? "bg-blue-50/80 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold shadow-2xs"
                    : "text-gray-600 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Doctor Profile Footer */}
      <div className="border-t border-gray-100 pt-4 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xs shrink-0 shadow-sm">
            BS
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
              {doctorInfo.fullName}
            </h4>
            <p className="text-[11px] text-gray-400 truncate mt-0.5">
              {doctorInfo.specialty}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="text-xs text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 p-1"
          title="Đăng xuất"
        >
          🚪
        </button>
      </div>
    </aside>
  );
}