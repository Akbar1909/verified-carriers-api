import { Module } from '@nestjs/common';
import { CarController } from './cars.controller';
import { CarService } from './cars.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
