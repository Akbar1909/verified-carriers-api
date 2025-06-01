// locations/locations.module.ts
import { Module } from '@nestjs/common';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

@Module({
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService], // Export if you need to use it in other modules
})
export class LocationsModule {}