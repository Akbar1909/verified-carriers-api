import { Module } from '@nestjs/common';
import { ModeratorsController } from './moderators.controller';
import { ModeratorsService } from './moderators.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ModeratorsController],
  providers: [ModeratorsService],
  exports: [ModeratorsService], // Export so AuthService can use it
})
export class ModeratorsModule {}
