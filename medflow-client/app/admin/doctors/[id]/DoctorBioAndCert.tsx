// app/admin/doctors/[id]/DoctorBioAndCert.tsx
import React from "react";
import { EducationItem } from "./types";

interface DoctorBioAndCertProps {
  bio: string;
  education: EducationItem[];
}

export default function DoctorBioAndCert({ bio, education }: DoctorBioAndCertProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Thẻ Tiểu sử chuyên môn */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-3">
          📋 Tiểu Sử Chuyên Môn
        </h3>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-300">
          {bio}
        </p>
      </div>

      {/* Thẻ Đào tạo & Chứng chỉ */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-4">
          🎓 Đào Tạo & Chứng Chỉ
        </h3>
        
        <div className="relative pl-6 border-l-2 border-gray-200 dark:border-zinc-700 flex flex-col gap-5">
          {education.map((item, idx) => (
            <div key={idx} className="relative">
              {/* Dot Timeline */}
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-zinc-900" />
              
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.degree}
              </h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                {item.institution} • {item.period}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}