import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async bookAppointment(patientId: string, dto: CreateAppointmentDto) {
    try {
      // Sử dụng Interactive Transaction của Prisma
      // Mọi thao tác trong này sẽ thành công toàn bộ (Commit) hoặc thất bại toàn bộ (Rollback)
      return await this.prisma.$transaction(async (tx) => {
        // 1. ATOMIC UPDATE: Kỹ thuật chống Race Condition cốt lõi
        // Chúng ta cố gắng cập nhật slot thành "isBooked = true",
        // NHƯNG điều kiện bắt buộc là slot đó phải đang ở trạng thái "isBooked = false".
        const lockedSlot = await tx.doctorAvailability.updateMany({
          where: {
            id: dto.availabilityId,
            doctorId: dto.doctorId,
            isBooked: false,
          },
          data: {
            isBooked: true,
          },
        });

        // Nhánh Điều Kiện 1 (MCDC Path 1): Cập nhật thất bại
        // Nghĩa là slot không tồn tại HOẶC vừa bị một bệnh nhân khác nẫng tay trên trong 1/1000 giây trước.
        if (lockedSlot.count === 0) {
          throw new ConflictException(
            'Khung giờ này đã được đặt hoặc không tồn tại. Vui lòng chọn giờ khác!',
          );
        }

        // Nhánh Điều Kiện 2 (MCDC Path 2): Cập nhật thành công (Slot đã thuộc về bệnh nhân này)
        // 2. Lấy thông tin thời gian của slot để ghi vào lịch hẹn
        const slotDetails = await tx.doctorAvailability.findUnique({
          where: { id: dto.availabilityId },
        });

        // 3. Tạo bản ghi lịch hẹn (Appointment)
        const newAppointment = await tx.appointment.create({
          data: {
            patientId: patientId,
            doctorId: dto.doctorId,
            startTime: slotDetails.startTime,
            endTime: slotDetails.endTime,
            status: AppointmentStatus.CONFIRMED,
            triageSessionId: dto.triageSessionId,
          },
        });

        return newAppointment;
      });
    } catch (error) {
      // Đảm bảo không nuốt mất lỗi ConflictException do chúng ta ném ra
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Lỗi hệ thống khi đặt lịch. Vui lòng thử lại.',
      );
    }
  }

  // Hàm tiện ích: Bác sĩ xem danh sách các ca khám của mình
  async getDoctorAppointments(doctorId: string) {
    return this.prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: {
          include: { user: { select: { fullName: true, phone: true } } },
        },
        triageSession: true, // Đính kèm báo cáo AI để bác sĩ đọc trước
      },
      orderBy: { startTime: 'asc' },
    });
  }
}
