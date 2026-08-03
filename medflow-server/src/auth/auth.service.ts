import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  // 1. LOGIN FLOW
  async login(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Tài khoản chưa được kích hoạt hoặc đã bị khóa.');
      }

      if (!user.password) {
        // Tài khoản cũ từ thời Cognito chưa có mật khẩu nội bộ. 
        // Tự động cập nhật mật khẩu này thành mật khẩu của họ (Tính năng Migrate cho Demo)
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
        }
      }

      // Generate JWT
      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        idToken: accessToken, // Fake idToken for client compatibility
        refreshToken: accessToken, // Fake refreshToken for client compatibility
        user,
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException(error.message || 'Lỗi hệ thống khi đăng nhập');
    }
  }

  // 2. REGISTER FLOW
  async register(fullName: string, email: string, password: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new BadRequestException('Email này đã được đăng ký.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const fakeCognitoId = `local_${Date.now()}_${Math.random().toString(36).substring(7)}`; 

      const user = await this.prisma.user.create({
        data: {
          email,
          fullName,
          password: hashedPassword,
          cognitoId: fakeCognitoId,
          isActive: true, // Auto-activate for local demo
          role: 'PATIENT',
          patientProfile: {
            create: {}
          }
        },
      });

      return {
        message: 'Đăng ký thành công. Tài khoản đã được kích hoạt (Bypass OTP demo).',
        user: { email: user.email, id: user.id },
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Lỗi đăng ký tài khoản');
    }
  }

  // 3. VERIFY OTP FLOW
  async verifyOtp(email: string, code: string) {
    // Demo mode: auto-verify since no emails are sent
    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: { isActive: true },
    });

    return {
      message: 'Xác nhận OTP thành công! Tài khoản đã được kích hoạt.',
      user: updatedUser,
    };
  }

  // 4. FORGOT PASSWORD FLOW
  async forgotPassword(email: string) {
    // Just fake it for the demo
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email này chưa được đăng ký trong hệ thống.');
    }
    return {
      message: 'Mã xác nhận (OTP) ảo đã được tạo. Vui lòng nhập OTP bất kỳ ở bước sau.',
    };
  }

  // 5. RESET PASSWORD FLOW
  async resetPassword(email: string, code: string, newPassword: string) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return {
        message: 'Mật khẩu đã được khôi phục thành công. Bạn có thể đăng nhập bằng mật khẩu mới.',
      };
    } catch (error: any) {
      throw new InternalServerErrorException('Lỗi đặt lại mật khẩu');
    }
  }

  // 6. CHANGE PASSWORD FLOW (Authenticated)
  async changePassword(accessToken: string, oldPassword: string, newPassword: string) {
    try {
      let decoded: any;
      try {
        decoded = this.jwtService.decode(accessToken);
      } catch (e) {
        throw new UnauthorizedException('Token không hợp lệ');
      }
      
      if (!decoded || !decoded.sub) throw new UnauthorizedException('Token không hợp lệ');
      
      const userId = decoded.sub;
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.password) throw new UnauthorizedException('Người dùng không tồn tại');

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) throw new BadRequestException('Mật khẩu cũ không chính xác.');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return {
        message: 'Mật khẩu đã được thay đổi thành công.',
      };
    } catch (error: any) {
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException(error.message || 'Lỗi đổi mật khẩu');
    }
  }
}
