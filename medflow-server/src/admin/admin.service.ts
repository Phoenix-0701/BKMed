import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor(private prisma: PrismaService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
  }

  async createDoctorAccount(
    email: string,
    fullName: string,
    phone: string,
    specialty: string,
    department: string,
  ) {
    try {
      // 1. Gọi AWS Cognito để tạo User.
      // Cognito sẽ tự động sinh mật khẩu ngẫu nhiên và gửi email cho bác sĩ.
      const command = new AdminCreateUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'email_verified', Value: 'true' },
        ],
        DesiredDeliveryMediums: ['EMAIL'], // AWS sẽ gửi email mời
      });

      const cognitoResponse = await this.cognitoClient.send(command);

      // Lấy UUID mà Cognito vừa tạo ra
      const cognitoId = cognitoResponse.User.Attributes.find(
        (attr) => attr.Name === 'sub',
      ).Value;

      // 2. Lưu vào PostgreSQL bằng Transaction để đảm bảo tính toàn vẹn dữ liệu
      const newDoctor = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            cognitoId: cognitoId,
            email: email,
            fullName: fullName,
            phone: phone,
            role: Role.DOCTOR,
          },
        });

        await tx.doctorProfile.create({
          data: {
            user: {
              connect: { id: user.id },
            },
            specialty: specialty,
            department: department,
          },
        });

        return user;
      });

      return {
        message:
          'Tạo tài khoản Bác sĩ thành công. Email chứa mật khẩu tạm thời đã được gửi.',
        doctor: newDoctor,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Lỗi khi tạo bác sĩ: ${error.message}`,
      );
    }
  }
  // 1. Lấy danh sách toàn bộ người dùng (Bác sĩ, Bệnh nhân)
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true, // Trả về trạng thái để UI hiển thị nút Khóa/Mở khóa
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 2. Khóa hoặc Mở khóa tài khoản
  async toggleUserLock(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng này.');
    }

    if (user.role === Role.ADMIN) {
      throw new BadRequestException(
        'Không thể khóa tài khoản của Quản trị viên hệ thống.',
      );
    }

    // Đảo ngược trạng thái hiện tại (Đang true thì thành false, và ngược lại)
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: { id: true, email: true, isActive: true },
    });

    return {
      message: updatedUser.isActive
        ? 'Đã mở khóa tài khoản.'
        : 'Đã khóa tài khoản thành công.',
      user: updatedUser,
    };
  }

  // 3. Lấy dữ liệu thống kê cho Dashboard
  async getDashboardStats() {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );

    // Chạy 4 câu query song song (Promise.all) để tối ưu hiệu suất, không bắt DB phải đợi tuần tự
    const [totalDoctors, totalPatients, totalAppointments, todayAppointments] =
      await Promise.all([
        this.prisma.user.count({ where: { role: Role.DOCTOR } }),
        this.prisma.user.count({ where: { role: Role.PATIENT } }),
        this.prisma.appointment.count(),
        this.prisma.appointment.count({
          where: {
            startTime: {
              gte: startOfToday,
              lte: endOfToday,
            },
          },
        }),
      ]);

    return {
      totalDoctors,
      totalPatients,
      totalAppointments,
      todayAppointments,
    };
  }
}
