import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class AvailabilitiesService {
  constructor(private readonly prisma: PrismaService) {}

  // Hàm Pure Logic: Cắt khoảng thời gian thành các Slot nhỏ.
  // Rất lý tưởng để áp dụng TDD (Test-Driven Development) và kiểm thử biên (Boundary value analysis).
  private generateTimeSlots(
    dateStr: string,
    startStr: string,
    endStr: string,
    duration: number,
  ) {
    const slots = [];
    const startTime = new Date(`${dateStr}T${startStr}:00`);
    const endTime = new Date(`${dateStr}T${endStr}:00`);
    const now = new Date();

    // Nhánh 1: Validation cơ bản
    if (startTime >= endTime) {
      throw new BadRequestException('Giờ kết thúc phải lớn hơn giờ bắt đầu.');
    }

    // Nhánh 2: Không cho phép tạo lịch trong quá khứ
    if (startTime < now) {
      throw new BadRequestException(
        'Không thể tạo lịch khám cho thời gian trong quá khứ.',
      );
    }

    let currentSlotStart = new Date(startTime);

    // Vòng lặp sinh khung giờ
    while (currentSlotStart < endTime) {
      const currentSlotEnd = new Date(
        currentSlotStart.getTime() + duration * 60000,
      );

      // Đảm bảo slot cuối cùng không vượt quá giờ kết thúc ca làm việc
      if (currentSlotEnd > endTime) break;

      slots.push({
        startTime: currentSlotStart,
        endTime: currentSlotEnd,
      });

      currentSlotStart = currentSlotEnd; // Nhảy đến slot tiếp theo
    }

    return slots;
  }

  async createSchedule(doctorId: string, dto: CreateScheduleDto) {
    // 1. Chạy thuật toán sinh danh sách slots
    const requestedSlots = this.generateTimeSlots(
      dto.date,
      dto.startTime,
      dto.endTime,
      dto.slotDuration,
    );

    if (requestedSlots.length === 0) {
      throw new BadRequestException(
        'Khoảng thời gian quá ngắn để tạo ca khám.',
      );
    }

    const dayStart = requestedSlots[0].startTime;
    const dayEnd = requestedSlots[requestedSlots.length - 1].endTime;

    // 2. Overlap Check: Tìm xem trong ngày này, bác sĩ đã có slot nào chưa
    const existingSlots = await this.prisma.doctorAvailability.findMany({
      where: {
        doctorId: doctorId,
        startTime: {
          gte: new Date(`${dto.date}T00:00:00`),
          lt: new Date(`${dto.date}T23:59:59`),
        },
      },
    });

    // Nhánh 3: Kiểm tra xung đột thời gian (Collision Detection)
    // Duyệt qua các slot chuẩn bị tạo, xem có đè lên slot nào đã tồn tại trong DB không
    for (const newSlot of requestedSlots) {
      const isOverlap = existingSlots.some(
        (existing) =>
          (newSlot.startTime >= existing.startTime &&
            newSlot.startTime < existing.endTime) ||
          (newSlot.endTime > existing.startTime &&
            newSlot.endTime <= existing.endTime) ||
          (newSlot.startTime <= existing.startTime &&
            newSlot.endTime >= existing.endTime),
      );

      if (isOverlap) {
        throw new ConflictException(
          `Khung giờ xung đột: Bác sĩ đã có lịch trong khoảng thời gian này.`,
        );
      }
    }

    // 3. Insert hàng loạt vào Database (Bulk Insert)
    const slotsToInsert = requestedSlots.map((slot) => ({
      doctorId: doctorId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: false, // Mặc định vừa tạo ra là chưa ai đặt
    }));

    await this.prisma.doctorAvailability.createMany({
      data: slotsToInsert,
    });

    return {
      message: `Đã tạo thành công ${slotsToInsert.length} khung giờ khám mới.`,
      slots: slotsToInsert,
    };
  }
}
