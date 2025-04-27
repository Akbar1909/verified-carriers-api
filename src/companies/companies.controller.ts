import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyAuthGuard } from '../auth/guards/company-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

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


  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
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