import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, Role } from '@prisma/client';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // API dành cho BỆNH NHÂN: Đặt lịch khám
  @Post('book')
  async book(
    @CurrentUser() user: User,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    if (user.role !== Role.PATIENT) {
      throw new ForbiddenException('Chỉ bệnh nhân mới có quyền đặt lịch.');
    }

    // Lưu ý: Lấy ID của patientProfile, không phải ID của user gốc
    const patientProfile = await this.appointmentsService[
      'prisma'
    ].patientProfile.findUnique({
      where: { userId: user.id },
    });

    return this.appointmentsService.bookAppointment(
      patientProfile.id,
      createAppointmentDto,
    );
  }

  // API dành cho BÁC SĨ: Xem danh sách lịch hẹn trong ngày
  @Get('my-schedule')
  async getMySchedule(@CurrentUser() user: User) {
    if (user.role !== Role.DOCTOR) {
      throw new ForbiddenException(
        'Chỉ bác sĩ mới có quyền truy cập lịch trình này.',
      );
    }

    const doctorProfile = await this.appointmentsService[
      'prisma'
    ].doctorProfile.findUnique({
      where: { userId: user.id },
    });

    return this.appointmentsService.getDoctorAppointments(doctorProfile.id);
  }
}
