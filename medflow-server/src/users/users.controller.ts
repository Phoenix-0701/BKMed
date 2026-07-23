import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

// Đặt prefix là /users
@Controller('users')
@UseGuards(JwtAuthGuard) // Toàn bộ API trong này đều yêu cầu JWT Token
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // API Lấy hồ sơ cá nhân: GET /users/me
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return this.usersService.getProfile(user.id, user.role);
  }

  // API Cập nhật hồ sơ: PATCH /users/me
  @Patch('me')
  updateMe(@CurrentUser() user: User, @Body() updateData: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, user.role, updateData);
  }
}
