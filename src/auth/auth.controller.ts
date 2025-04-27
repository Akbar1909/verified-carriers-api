import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterCompanyDto } from '../companies/dto/register-company.dto';
import { RegisterUserDto } from '../users/dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User authentication endpoints
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  // Company authentication endpoints
  @Post('company/login')
  companyLogin(@Body() loginDto: LoginDto) {
    return this.authService.companyLogin(loginDto);
  }

  @Post('company/register')
  registerCompany(@Body() registerCompanyDto: RegisterCompanyDto) {
    return this.authService.registerCompany(registerCompanyDto);
  }

  // Get current authenticated profile
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user) {
    return user;
  }
}