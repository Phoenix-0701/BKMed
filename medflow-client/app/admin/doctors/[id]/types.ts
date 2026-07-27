// app/admin/doctors/[id]/types.ts

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export interface DoctorDetail {
  id: string;
  fullName: string;
  title: string; // VD: Trưởng Khoa Tim Mạch
  email: string;
  phone: string;
  docCode: string; // VD: DOC-8472
  status: "ACTIVE" | "INACTIVE";
  avatar: string;
  totalPatients: number;
  yearsOfExperience: number;
  bio: string;
  education: EducationItem[];
}

export interface RecentAppointment {
  id: string;
  patientName: string;
  patientInitials: string;
  time: string;
  reason: string;
  status: "COMPLETED" | "FOLLOW_UP" | "CANCELLED";
}