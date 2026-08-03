import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor'; // Import Interceptor vừa tạo

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cấu hình phục vụ file tĩnh (cho hình ảnh Avatar)
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  // Kích hoạt tính năng tự động validate DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Kích hoạt CORS để Frontend Next.js có thể gọi API mà không bị chặn
  app.enableCors();

  // === ĐĂNG KÝ INTERCEPTOR TẠI ĐÂY ===
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
