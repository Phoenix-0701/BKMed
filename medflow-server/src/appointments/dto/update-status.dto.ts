import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentStatusDto {
  @IsNotEmpty()
  @IsEnum(AppointmentStatus, { message: 'Trạng thái truyền lên không hợp lệ.' })
  status: AppointmentStatus;
}
