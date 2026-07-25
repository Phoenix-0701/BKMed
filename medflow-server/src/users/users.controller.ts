import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

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
}
