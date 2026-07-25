import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, Role } from '@prisma/client';

@Controller('availabilities')
export class AvailabilitiesController {
  constructor(private readonly availabilitiesService: AvailabilitiesService) {}

  // --- API DÀNH CHO BÁC SĨ (Private) ---
  @UseGuards(JwtAuthGuard)
  @Post('create-schedule')
  async createSchedule(
    @CurrentUser() user: User,
    @Body() dto: CreateScheduleDto,
  ) {
    if (user.role !== Role.DOCTOR) {
      throw new ForbiddenException('Chỉ bác sĩ mới có quyền mở lịch khám.');
    }

    const doctorProfile = await this.availabilitiesService[
      'prisma'
    ].doctorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!doctorProfile) {
      throw new ForbiddenException('Không tìm thấy hồ sơ bác sĩ.');
    }

    return this.availabilitiesService.createSchedule(doctorProfile.id, dto);
  }

  // --- API DÀNH CHO CLIENT / BỆNH NHÂN (Public) ---
  @Get('doctors/:doctorId')
  async getDoctorSlots(
    @Param('doctorId') doctorId: string,
    @Query('date') date?: string, // Query Param tùy chọn (VD: ?date=2026-07-25)
  ) {
    return this.availabilitiesService.getAvailableSlotsByDoctor(doctorId, date);
  }
}
