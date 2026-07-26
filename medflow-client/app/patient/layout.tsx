// app/patient/layout.tsx
"use client";

import PatientSidebar from "./Sidebar";
import Link from "next/link";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-50/40 dark:bg-black font-sans flex-col">
      {/* Header Top Nav */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/90 px-8 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90">
        <Link href="/patient" className="text-xl font-extrabold text-blue-900 dark:text-blue-400 flex items-center gap-2">
          <span>🩺</span> MedFlow AI
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-600 dark:text-zinc-300">
          <Link href="#" className="hover:text-blue-600">Features</Link>
          <Link href="#" className="text-blue-600 font-bold underline underline-offset-4">AI Triage</Link>
          <Link href="#" className="hover:text-blue-600">Clinical Accuracy</Link>
          <Link href="#" className="hover:text-blue-600">Enterprise</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSignOut}
            className="text-xs font-semibold text-gray-600 hover:text-rose-600 dark:text-zinc-300 cursor-pointer"
          >
            Sign Out
          </button>
          <Link
            href="/patient/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 font-bold text-white text-xs shadow-2xs"
          >
            BN
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1">
        <PatientSidebar />
        <main className="flex-1 p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}