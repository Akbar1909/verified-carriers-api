import { Module } from '@nestjs/common';
import { ZipCodeService } from './zip-code.service';
import { ZipCodeController } from './zip-code.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ZipCodeController],
  providers: [ZipCodeService, PrismaService],
})
export class ZipCodeModule {}
