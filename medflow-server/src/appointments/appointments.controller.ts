import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, Role } from '@prisma/client';
import { UpdateNotesDto } from './dto/update-notes.dto';

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
  // --- API DÀNH CHO BỆNH NHÂN ---
  @Get('me')
  async getMyAppointments(@CurrentUser() user: User) {
    if (user.role !== Role.PATIENT) {
      throw new ForbiddenException(
        'Chỉ bệnh nhân mới có quyền xem danh sách lịch hẹn của mình.',
      );
    }

    const patientProfile = await this.appointmentsService[
      'prisma'
    ].patientProfile.findUnique({
      where: { userId: user.id },
    });

    return this.appointmentsService.getPatientAppointments(patientProfile.id);
  }

  // --- API DÀNH CHO BÁC SĨ ---
  @Patch(':id/status')
  async updateStatus(
    @Param('id') appointmentId: string,
    @Body() dto: UpdateAppointmentStatusDto,
    @CurrentUser() user: User,
  ) {
    if (user.role !== Role.DOCTOR) {
      throw new ForbiddenException(
        'Chỉ bác sĩ mới có quyền cập nhật trạng thái ca khám.',
      );
    }

    const doctorProfile = await this.appointmentsService[
      'prisma'
    ].doctorProfile.findUnique({
      where: { userId: user.id },
    });

    return this.appointmentsService.updateAppointmentStatus(
      doctorProfile.id,
      appointmentId,
      dto.status,
    );
  }
  @Patch(':id/cancel')
  async cancelAppointment(
    @Param('id') appointmentId: string,
    @CurrentUser() user: User,
  ) {
    // Chặn luồng nếu người gọi không phải là bệnh nhân
    if (user.role !== Role.PATIENT) {
      throw new ForbiddenException('Chỉ bệnh nhân mới có quyền tự hủy lịch.');
    }

    const patientProfile = await this.appointmentsService[
      'prisma'
    ].patientProfile.findUnique({
      where: { userId: user.id },
    });

    if (!patientProfile) {
      throw new BadRequestException('Không tìm thấy hồ sơ bệnh nhân.');
    }

    return this.appointmentsService.cancelAppointment(
      patientProfile.id,
      appointmentId,
    );
  }

  // --- API GHI BỆNH ÁN (DÀNH CHO BÁC SĨ) ---
  @Patch(':id/notes')
  async updateNotes(
    @Param('id') appointmentId: string,
    @Body() dto: UpdateNotesDto,
    @CurrentUser() user: User,
  ) {
    if (user.role !== Role.DOCTOR) {
      throw new ForbiddenException(
        'Chỉ bác sĩ mới có quyền ghi hồ sơ bệnh án.',
      );
    }

    const doctorProfile = await this.appointmentsService[
      'prisma'
    ].doctorProfile.findUnique({
      where: { userId: user.id },
    });

    return this.appointmentsService.updateAppointmentNotes(
      doctorProfile.id,
      appointmentId,
      dto,
    );
  }
}
