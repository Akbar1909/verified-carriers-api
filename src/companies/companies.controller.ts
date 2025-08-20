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
  Req,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyAuthGuard } from '../auth/guards/company-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FilterCompanyDto } from './dto/filter-company.dto';
import { HeaderSearchDto } from './dto/header-search.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly jwtService: JwtService,
  ) {}

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
  count(@Query() filterDto: FilterCompanyDto) {
    return this.companiesService.findCount(filterDto);
  }

  @Get('header-search')
  async headerSearch(@Query() dto: HeaderSearchDto) {
    return this.companiesService.headerSearch(dto.keyword, dto.size);
  }

  @Get()
  findAll(@Query() filterDto: FilterCompanyDto, @Req() req: Request) {
    let userId: string | undefined;

    // check if auth header present
    const authHeader = req.headers['authorization'];

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        }); // 👈 decode token
        userId = payload.sub; // or payload.id depending on your JWT
      } catch (err) {
        console.log({ err });
        // invalid token → just ignore, leave userId undefined
      }
    }

    return this.companiesService.findAll({ ...filterDto, userId });
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

  @Get(':companyId/also-looked')
  async getAlsoLooked(
    @Param('companyId') companyId: string,
    @Query('limit') limit: string,
  ) {
    return this.companiesService.peopleAlsoLookedAt(
      companyId,
      Number(limit) || 5,
    );
  }

  @Get(':companyId/other-reviews')
  async getOtherReviews(
    @Param('companyId') companyId: string,
    @Query('limit') limit = '4',
  ) {
    return this.companiesService.getOtherReviewedCompanies(
      companyId,
      Number(limit),
    );
  }
}
