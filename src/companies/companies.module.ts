import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { FilesModule } from '../files/files.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [FilesModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, JwtService],
  exports: [CompaniesService],
})
export class CompaniesModule {}