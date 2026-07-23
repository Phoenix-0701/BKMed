import { Module } from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { AvailabilitiesController } from './availabilities.controller';

@Module({
  providers: [AvailabilitiesService],
  controllers: [AvailabilitiesController]
})
export class AvailabilitiesModule {}
