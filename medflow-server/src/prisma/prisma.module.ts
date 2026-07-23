import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Đánh dấu module này là Global
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export ra để các module khác xài được
})
export class PrismaModule {}
