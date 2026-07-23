import {
  Controller,
  Post,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, Role } from '@prisma/client';

@Controller('availabilities')
@UseGuards(JwtAuthGuard)
export class AvailabilitiesController {
  constructor(private readonly availabilitiesService: AvailabilitiesService) {}

  @Post('create-schedule')
  async createSchedule(
    @CurrentUser() user: User,
    @Body() dto: CreateScheduleDto,
  ) {
    if (user.role !== Role.DOCTOR) {
      throw new ForbiddenException('Chỉ bác sĩ mới có quyền mở lịch khám.');
    }

    // Lấy ID của hồ sơ bác sĩ từ DB
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
}
