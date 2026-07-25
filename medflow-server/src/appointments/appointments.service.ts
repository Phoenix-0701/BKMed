import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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

  // 1. NGHIỆP VỤ BÁC SĨ: Cập nhật trạng thái lịch hẹn
  async updateAppointmentStatus(
    doctorId: string,
    appointmentId: string,
    status: AppointmentStatus,
  ) {
    // Tìm lịch hẹn để kiểm tra xem nó có tồn tại không
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Không tìm thấy ca khám này.');
    }

    // Bảo mật: Kiểm tra xem ca khám này có đúng là của bác sĩ đang đăng nhập không
    // (Test case quan trọng: Bác sĩ A truyền ID lịch của Bác sĩ B -> Phải văng lỗi)
    if (appointment.doctorId !== doctorId) {
      throw new ForbiddenException(
        'Bạn không có quyền thay đổi trạng thái ca khám của bác sĩ khác.',
      );
    }

    // Tiến hành cập nhật
    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: status },
    });
  }

  // 2. NGHIỆP VỤ BỆNH NHÂN: Xem lịch sử / lịch sắp tới
  async getPatientAppointments(patientId: string) {
    return this.prisma.appointment.findMany({
      where: { patientId: patientId },
      include: {
        // Kéo theo thông tin bác sĩ để hiển thị lên UI cho đẹp
        doctor: {
          include: {
            user: { select: { fullName: true, phone: true } },
          },
        },
        triageSession: true, // Nếu bệnh nhân muốn xem lại kết quả AI chẩn đoán
      },
      orderBy: {
        startTime: 'desc', // Ca khám mới nhất (hoặc sắp tới) sẽ nổi lên đầu
      },
    });
  }
  // 3. NGHIỆP VỤ BỆNH NHÂN: Hủy lịch khám
  async cancelAppointment(patientId: string, appointmentId: string) {
    // 1. Kiểm tra tính hợp lệ của lịch hẹn
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Không tìm thấy lịch hẹn này.');
    }

    // Nhánh bảo mật: Chặn bệnh nhân A hủy lịch của bệnh nhân B
    if (appointment.patientId !== patientId) {
      throw new ForbiddenException(
        'Bạn không có quyền hủy lịch hẹn của người khác.',
      );
    }

    // Nhánh logic: Không thể hủy một lịch đã bị hủy từ trước
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Lịch hẹn này đã được hủy trước đó.');
    }

    // Nhánh logic: Không thể hủy lịch khi đã khám xong
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Không thể hủy lịch hẹn đã hoàn tất.');
    }

    // 2. Mở Transaction để Hủy lịch và Nhả slot cùng một lúc (Atomic)
    return await this.prisma.$transaction(async (tx) => {
      // Hành động 1: Cập nhật status của Appointment thành CANCELLED
      const cancelledAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.CANCELLED },
      });

      // Hành động 2: Nhả slot (DoctorAvailability)
      // Tìm chính xác slot dựa trên ID bác sĩ và khoảng thời gian của ca khám bị hủy
      await tx.doctorAvailability.updateMany({
        where: {
          doctorId: appointment.doctorId,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          isBooked: true, // Chỉ nhả các slot đang bị khóa
        },
        data: {
          isBooked: false, // Trả lại slot cho cộng đồng
        },
      });

      return {
        message:
          'Đã hủy lịch khám thành công. Khung giờ này đã được mở lại cho bệnh nhân khác.',
        appointment: cancelledAppointment,
      };
    });
  }
}
