import { Module } from '@nestjs/common';
import { CompanyViewService } from './company-view.service';
import { CompanyViewController } from './company-view.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CompanyViewController],
  providers: [CompanyViewService],
  imports:[JwtModule],
  exports: [CompanyViewService], // 👈 if other modules need to use it
})
export class CompanyViewModule {}
