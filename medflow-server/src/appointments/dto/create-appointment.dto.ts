import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsUUID()
  doctorId: string;

  @IsNotEmpty()
  @IsUUID()
  availabilityId: string; // ID của khung giờ trống mà bác sĩ đã tạo

  @IsOptional()
  @IsUUID()
  triageSessionId?: string; // Tùy chọn: Gắn kết quả AI (nếu bệnh nhân đi từ luồng AI chat)
}
