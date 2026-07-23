import { IsNotEmpty, IsString, Matches, IsInt, Min } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Ngày phải có định dạng YYYY-MM-DD',
  })
  date: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Giờ bắt đầu phải là HH:mm',
  })
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Giờ kết thúc phải là HH:mm',
  })
  endTime: string;

  @IsNotEmpty()
  @IsInt()
  @Min(10, { message: 'Mỗi ca khám tối thiểu 10 phút' })
  slotDuration: number; // Đơn vị: Phút
}
