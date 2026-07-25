import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule, // Import Prisma để JwtStrategy có thể query DB
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
