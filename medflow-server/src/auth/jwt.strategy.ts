// src/auth/jwt.strategy.ts
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Lấy Token từ Header Authorization Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Sử dụng JWT Secret cục bộ
      secretOrKey: process.env.JWT_SECRET || 'medflow-secret-key-for-local-demo-only',
    });
  }

  // Hàm validate chỉ chạy khi Token đã được verify chữ ký và còn hạn
  async validate(payload: any) {
    // Payload của local JWT Access Token chứa 'sub' là ID của user
    const userId = payload.sub;

    // Đối chiếu với Database
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException(
        'User is authenticated but not found in the local database.',
      );
    }

    if (user.isActive === false) {
      throw new ForbiddenException(
        'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.',
      );
    }

    // Object return ở đây sẽ được NestJS tự động nhét vào req.user
    return user;
  }
}
