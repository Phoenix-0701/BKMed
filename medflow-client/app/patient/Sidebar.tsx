// app/patient/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PatientSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/patient", icon: "📊" },
    { name: "Patient Profile", href: "/patient/profile", icon: "👤" },
    { name: "Medical History", href: "/patient/history", icon: "🕒" },
    { name: "Settings", href: "/patient/settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 min-h-screen p-5 flex flex-col justify-between">
      <div>
        {/* Menu Title */}
        <p className="px-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-3">
          MENU
        </p>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/patient"
                ? pathname === "/patient"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all min-h-[46px] ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-2xs"
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

      {/* AI Assistant Widget Card */}
      <div className="rounded-2xl bg-blue-50/70 p-4 dark:bg-blue-950/40 border border-blue-100/80 dark:border-blue-900/40">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xl">🤖</span>
          <h4 className="text-xs font-bold text-gray-900 dark:text-white">
            AI Assistant
          </h4>
        </div>
        <p className="text-[11px] leading-relaxed text-gray-500 dark:text-zinc-400">
          Your AI insights are active and monitoring patient vitals.
        </p>
      </div>
    </aside>
  );
}