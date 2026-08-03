import {
  Controller,
  Get,
  Patch,
  Put,
  Body,
  UseGuards,
  Param,
  Query,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, Role } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==========================================
  // NHÓM PUBLIC API (Không cần đăng nhập)
  // ==========================================

  @Get('public/doctors')
  getPublicDoctors(@Query('limit') limit?: string) {
    return this.usersService.getPublicDoctors(
      limit ? parseInt(limit) : undefined,
    );
  }

  @Get('public/doctors/:id')
  getPublicDoctorById(@Param('id') id: string) {
    return this.usersService.getPublicDoctorById(id);
  }

  @Get('public/reviews')
  getPublicReviews(@Query('limit') limit?: string) {
    return this.usersService.getPublicReviews(limit ? parseInt(limit) : 3);
  }

  @Get('public/top-doctors')
  getTopDoctors() {
    return this.usersService.getTopDoctors();
  }

  // ==========================================
  // NHÓM PRIVATE API (Bắt buộc đăng nhập)
  // ==========================================

  @UseGuards(JwtAuthGuard) // Gắn bảo vệ vào từng hàm cụ thể
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return this.usersService.getProfile(user.id, user.role);
  }

  @UseGuards(JwtAuthGuard) // Gắn bảo vệ vào từng hàm cụ thể
  @Patch('me')
  updateMe(@CurrentUser() user: User, @Body() updateData: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, user.role, updateData);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me/avatar-upload-url')
  getAvatarUploadUrl(
    @CurrentUser() user: User,
    @Query('fileName') fileName: string,
    @Query('fileType') fileType: string,
  ) {
    if (!fileName || !fileType) {
      return { error: 'Vui lòng cung cấp fileName và fileType' };
    }
    return this.usersService.getPresignedUrl(user.id, fileName, fileType);
  }

  // --- API XỬ LÝ UPLOAD TRỰC TIẾP LÊN SERVER (Thay cho S3) ---
  @Put('me/upload-avatar')
  async uploadAvatarRaw(@Req() req: any, @Query('fileName') fileName: string) {
    // fileName đã được truyền ở dạng: avatars/userId-timestamp-name.jpg
    const safeFileName = fileName || `avatars/unknown-${Date.now()}.jpg`;
    const uploadDir = path.join(process.cwd(), 'public');
    
    // Đảm bảo thư mục public/avatars tồn tại
    const targetDir = path.join(uploadDir, path.dirname(safeFileName));
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeFileName);

    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath);
      req.pipe(writeStream);
      req.on('end', () => {
        resolve({ message: 'Upload thành công' });
      });
      req.on('error', (err: any) => {
        reject(err);
      });
    });
  }

  // ==========================================
  // API QUẢN LÝ BỆNH NHÂN (Dành cho Bác sĩ)
  // ==========================================
  
  @UseGuards(JwtAuthGuard)
  @Get('patients/:id')
  getPatientDetails(@CurrentUser() user: User, @Param('id') patientId: string) {
    if (user.role !== Role.DOCTOR) {
      throw new ForbiddenException('Chỉ bác sĩ mới có quyền truy cập hồ sơ chi tiết bệnh nhân.');
    }
    return this.usersService.getPatientDetails(patientId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('patients/:id')
  updatePatientStats(
    @CurrentUser() user: User, 
    @Param('id') patientId: string, 
    @Body() body: { weight?: number; height?: number; bloodType?: string }
  ) {
    if (user.role !== Role.DOCTOR) {
      throw new ForbiddenException('Chỉ bác sĩ mới có quyền cập nhật thông số bệnh nhân.');
    }
    return this.usersService.updatePatientStats(patientId, body);
  }
}
