import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
}
