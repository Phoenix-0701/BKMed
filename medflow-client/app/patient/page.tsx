// app/patient/profile/page.tsx
"use client";

import { useEffect, useState } from "react";

interface PatientProfileData {
  fullName: string;
  email: string;
  phone: string;
  patientProfile?: {
    dateOfBirth?: string;
    gender?: string;
    height?: number;
    weight?: number;
    bloodType?: string;
    medicalHistory?: string;
  };
}

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<PatientProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:4000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Lỗi fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const fullName = profile?.fullName || "Robert Jenkins";
  const gender = profile?.patientProfile?.gender || "Male";
  const height = profile?.patientProfile?.height || 182;
  const weight = profile?.patientProfile?.weight || 84.5;
  const bloodType = profile?.patientProfile?.bloodType || "O Positive (O+)";

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Title + Edit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Patient Profile
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Manage and review patient health data.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 cursor-pointer">
          ✏️ Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personal Vitals Card */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Main User Card */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col items-center text-center">
            <div className="h-28 w-28 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-gray-400 font-bold text-xl mb-4 shadow-inner">
              img
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
              {fullName}
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 font-medium">
              45 yrs • {gender}
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-mono font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              🆔 ID: MRN-84729-A
            </div>
          </div>

          {/* Vitals Grid: Height & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-emerald-600 text-lg">↕</span>
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mt-2">
                HEIGHT
              </p>
              <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">
                {height} <span className="text-xs font-normal text-gray-400">cm</span>
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-blue-600 text-lg">⌛</span>
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mt-2">
                WEIGHT
              </p>
              <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">
                {weight} <span className="text-xs font-normal text-gray-400">kg</span>
              </p>
            </div>
          </div>

          {/* Blood Type Card */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between">
            <div>
              <span className="text-rose-600 text-lg">🩸</span>
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mt-1">
                BLOOD TYPE
              </p>
              <p className="text-base font-extrabold text-gray-900 dark:text-white mt-1">
                {bloodType}
              </p>
            </div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
              Verified
            </span>
          </div>
        </div>

        {/* Right Column: Medical History & Account Settings */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Medical History Timeline */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                🩺 Medical History
              </h3>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                ✨ AI Summarized
              </span>
            </div>

            <div className="relative pl-6 flex flex-col gap-6 border-l-2 border-gray-100 dark:border-zinc-800 ml-2">
              <div>
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-blue-600 bg-white dark:bg-zinc-900" />
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  Type 2 Diabetes Mellitus
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Diagnosed: Oct 2018</p>
                <p className="text-xs text-gray-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Currently managed with Metformin 500mg twice daily. HbA1c stable at 6.8% as of last checkup.
                </p>
              </div>

              <div>
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-gray-300 bg-white dark:bg-zinc-900" />
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  Hypertension
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Diagnosed: May 2015</p>
                <p className="text-xs text-gray-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Controlled with Lisinopril 10mg daily. Recent BP readings average 125/80 mmHg.
                </p>
              </div>

              <div>
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-gray-300 bg-white dark:bg-zinc-900" />
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                  Appendectomy
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">Surgical: Jun 2005</p>
                <p className="text-xs text-gray-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Uncomplicated laparoscopic procedure. No residual issues reported.
                </p>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              ⚙️ Account Settings
            </h3>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200/70 p-3.5 dark:border-zinc-800 flex items-start gap-3">
                  <span className="text-base">🔒</span>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Change Password</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Update credentials and security protocols.</p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200/70 p-3.5 dark:border-zinc-800 flex items-start gap-3">
                  <span className="text-base">🌐</span>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Language & Region</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Set to English (US). Timezone: EST.</p>
                  </div>
                </div>
              </div>

              {/* Toggle Switch Clinical Notifications */}
              <div className="rounded-xl border border-gray-200/70 p-3.5 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-base">🔔</span>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">Clinical Notifications</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Receive alerts for abnormal lab results and AI triage updates.</p>
                  </div>
                </div>

                <div className="h-6 w-11 rounded-full bg-blue-700 p-0.5 cursor-pointer flex items-center justify-end shadow-2xs">
                  <div className="h-5 w-5 rounded-full bg-white shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}