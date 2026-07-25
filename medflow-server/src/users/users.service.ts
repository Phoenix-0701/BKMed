import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Lấy toàn bộ thông tin User kèm Profile (dựa theo Role)
  async getProfile(userId: string, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        patientProfile: role === Role.PATIENT,
        doctorProfile: role === Role.DOCTOR,
      },
    });

    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }

  // Cập nhật thông tin phân nhánh theo Role
  async updateProfile(userId: string, role: Role, data: UpdateProfileDto) {
    // 1. Tách dữ liệu chung (bảng User)
    const { fullName, phone, ...profileData } = data;

    // Cập nhật bảng User cơ sở
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { fullName }),
        ...(phone && { phone }),
      },
    });

    // 2. Nhánh cập nhật cho BỆNH NHÂN
    if (role === Role.PATIENT) {
      await this.prisma.patientProfile.upsert({
        where: { userId: userId },
        create: {
          userId: userId,
          dateOfBirth: profileData.dateOfBirth
            ? new Date(profileData.dateOfBirth)
            : null,
          gender: profileData.gender,
          bloodType: profileData.bloodType,
          allergies: profileData.allergies,
          medicalHistory: profileData.medicalHistory,
        },
        update: {
          ...(profileData.dateOfBirth && {
            dateOfBirth: new Date(profileData.dateOfBirth),
          }),
          ...(profileData.gender && { gender: profileData.gender }),
          ...(profileData.bloodType && { bloodType: profileData.bloodType }),
          ...(profileData.allergies && { allergies: profileData.allergies }),
          ...(profileData.medicalHistory && {
            medicalHistory: profileData.medicalHistory,
          }),
        },
      });
    }

    // 3. Nhánh cập nhật cho BÁC SĨ
    if (role === Role.DOCTOR) {
      await this.prisma.doctorProfile.upsert({
        where: { userId: userId },
        create: {
          userId: userId,
          specialty: profileData.specialty || 'Chưa cập nhật',
          department: profileData.department || 'Chưa cập nhật',
        },
        update: {
          ...(profileData.specialty && { specialty: profileData.specialty }),
          ...(profileData.department && { department: profileData.department }),
        },
      });
    }

    // Trả về dữ liệu mới nhất
    return this.getProfile(userId, role);
  }

  // Hàm lấy danh sách bác sĩ cho Landing Page
  async getPublicDoctors(limit: number = 4) {
    return this.prisma.user.findMany({
      where: {
        role: Role.DOCTOR,
      },
      select: {
        id: true,
        fullName: true,
        doctorProfile: {
          select: {
            specialty: true,
            department: true,
          },
        },
      },
      take: limit, // Lấy 4 bác sĩ nổi bật nhất
    });
  }
  // 1. PUBLIC API: Lấy danh sách tất cả bác sĩ
  async getPublicDoctors(limit?: number) {
    return this.prisma.user.findMany({
      where: {
        role: Role.DOCTOR,
      },
      select: {
        id: true,
        fullName: true,
        doctorProfile: {
          select: {
            specialty: true,
            department: true,
          },
        },
      },
      // Nếu có truyền limit, sẽ giới hạn số lượng trả về (VD: lấy 4 bác sĩ cho trang chủ)
      take: limit ? Number(limit) : undefined,
    });
  }

  // 2. PUBLIC API: Lấy chi tiết 1 bác sĩ
  async getPublicDoctorById(doctorId: string) {
    const doctor = await this.prisma.user.findFirst({
      where: {
        id: doctorId,
        role: Role.DOCTOR,
      },
      select: {
        id: true,
        fullName: true,
        doctorProfile: {
          select: {
            specialty: true,
            department: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException('Không tìm thấy thông tin bác sĩ này.');
    }

    return doctor;
  }
}
