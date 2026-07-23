import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard) // Bật bảo vệ 2 lớp (Phải có Token + Phải qua kiểm tra Role)
@Roles(Role.ADMIN) // Khóa API này lại, CHỈ ADMIN được vào
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('doctors')
  createDoctor(
    @Body('email') email: string,
    @Body('fullName') fullName: string,
    @Body('phone') phone: string,
    @Body('specialty') specialty: string,
    @Body('department') department: string,
  ) {
    return this.adminService.createDoctorAccount(
      email,
      fullName,
      phone,
      specialty,
      department,
    );
  }
}
