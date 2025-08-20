// saved-company.module.ts
import { Module } from '@nestjs/common';
import { SavedCompanyService } from './saved-company.service';
import { SavedCompanyController } from './saved-company.controller';


@Module({
  controllers: [SavedCompanyController],
  providers: [SavedCompanyService],
  exports: [SavedCompanyService],
})
export class SavedCompanyModule {}
