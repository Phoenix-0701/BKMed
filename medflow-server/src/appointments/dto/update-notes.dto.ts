import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNotesDto {
  @IsNotEmpty({ message: 'Kết luận chẩn đoán không được để trống.' })
  @IsString()
  diagnosis: string;

  @IsOptional() // Đơn thuốc có thể có hoặc không tùy tình trạng bệnh
  @IsString()
  prescription?: string;
}
