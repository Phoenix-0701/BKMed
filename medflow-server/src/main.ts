// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Thêm dòng này để kích hoạt validate toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các field không có trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu client gửi field lạ
    }),
  );

  await app.listen(3000);
}
bootstrap();
