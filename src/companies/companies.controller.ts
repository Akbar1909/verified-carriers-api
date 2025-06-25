import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyAuthGuard } from '../auth/guards/company-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FilterCompanyDto } from './dto/filter-company.dto';
import { ModeratorGuard } from 'src/auth/guards/moderator.guard';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // Step 1: Initial company registration
  @Post('register')
  register(@Body() registerCompanyDto: RegisterCompanyDto) {
    return this.companiesService.register(registerCompanyDto);
  }

  // Step 2: Complete company profile (uses authenticated company from token)
  @Patch('complete-profile')
  @UseGuards(CompanyAuthGuard)
  completeProfile(
    @CurrentUser() company,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.completeProfile(company.id, updateCompanyDto);
  }

  @Get('me')
  @UseGuards(CompanyAuthGuard)
  me(@CurrentUser() company) {
    return this.companiesService.me(company?.id);
  }

  @Get('count')
  count() {
    return this.companiesService.findCount();
  }

  @Get()
  findAll(@Query() filterDto: FilterCompanyDto) {
    return this.companiesService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Post('/verify/:id')
  // @UseGuards(ModeratorGuard)
  verifyCompany(@Param('id') id: string) {
    return this.companiesService.verifyCompany(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }

  @Delete('logos/:id')
  @UseGuards(JwtAuthGuard)
  removeLogo(@Param('id') id: string) {
    return this.companiesService.removeLogo(id);
  }

  @Delete('services/:id')
  @UseGuards(JwtAuthGuard)
  removeService(@Param('id') id: string) {
    return this.companiesService.removeService(id);
  }

  @Delete('contact-information/:id')
  @UseGuards(JwtAuthGuard)
  removeContactInformation(@Param('id') id: string) {
    return this.companiesService.removeContactInformation(id);
  }
}
