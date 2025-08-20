// saved-company.controller.ts
import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SavedCompanyService } from './saved-company.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('saved-companies')
@UseGuards(JwtAuthGuard)
export class SavedCompanyController {
  constructor(private readonly savedCompanyService: SavedCompanyService) {}

  @UseGuards(UserAuthGuard)
  @Post(':companyId')
  async save(@CurrentUser() user, @Param('companyId') companyId: string) {
    return this.savedCompanyService.saveCompany(user.id, companyId);
  }

  @UseGuards(UserAuthGuard)
  @Delete(':companyId')
  async unsave(@CurrentUser() user, @Param('companyId') companyId: string) {
    return this.savedCompanyService.unsaveCompany(user.id, companyId);
  }

  @Get(':userId')
  async list(@Param('userId') userId: string) {
    return this.savedCompanyService.listSavedCompanies(userId);
  }
}
