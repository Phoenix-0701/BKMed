import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvailabilitiesModule } from './availabilities/availabilities.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, AppointmentsModule, AvailabilitiesModule, AdminModule],
  controllers: [AppController, AdminController],
  providers: [AppService, AdminService],
})
export class AppModule {}
