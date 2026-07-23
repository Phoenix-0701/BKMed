// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // Lấy Token từ Header Authorization Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      // Khai báo Issuer của Cognito
      issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
      algorithms: ['RS256'],

      // Tự động fetch Public Keys (JWKS) từ AWS Cognito để verify token
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
      }),
    });
  }

  // Hàm validate chỉ chạy khi Token đã được verify chữ ký và còn hạn
  async validate(payload: any) {
    // Payload của Cognito JWT Access Token chứa 'sub' là ID duy nhất của user
    const cognitoId = payload.sub;

    // Đối chiếu với Database của chúng ta
    const user = await this.prisma.user.findUnique({
      where: { cognitoId: cognitoId },
    });

    if (!user) {
      throw new UnauthorizedException(
        'User is authenticated but not found in the local database.',
      );
    }

    // Object return ở đây sẽ được NestJS tự động nhét vào req.user
    return user;
  }
}
