import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { RegisterCompanyDto } from '../companies/dto/register-company.dto';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterModeratorDto } from 'src/moderators/dto/register-moderator.dto';
import { ModeratorsService } from 'src/moderators/moderators.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private companiesService: CompaniesService,
    private usersService: UsersService,
    private moderatorsService: ModeratorsService,
  ) {}

  // User login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      type: 'user',
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        registrationStatus: user.profileStatus,
      },
    };
  }

  // User registration with token generation
  async registerUser(registerUserDto: RegisterUserDto) {
    // Create the user using user service
    const user = await this.usersService.register(registerUserDto);

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      type: 'user',
    });

    // Return token and user info
    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  // Company login
  async companyLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find company by work email
    const company = await this.prisma.company.findUnique({
      where: { workEmail: email },
    });

    if (!company) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, company.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const token = this.jwtService.sign({
      sub: company.id,
      email: company.workEmail,
      type: 'company',
    });

    return {
      token,
      company: {
        id: company.id,
        name: company.name,
        email: company.workEmail,
        registrationStatus: company.registrationStatus,
      },
    };
  }

  // Company registration with token generation
  async registerCompany(registerCompanyDto: RegisterCompanyDto) {
    // Create the company using company service
    const company = await this.companiesService.register(registerCompanyDto);

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: company.id,
      email: company.workEmail,
      type: 'company',
    });

    // Return token and company info
    return {
      token,
      company: {
        id: company.id,
        name: company.name,
        email: company.workEmail,
        registrationStatus: company.registrationStatus,
      },
    };
  }

  // Validate user from JWT
  async validateUser(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password, ...result } = user;
    return result;
  }

  // Validate company from JWT
  async validateCompany(companyId: string): Promise<any> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return null;
    }

    const { password, ...result } = company;
    return result;
  }

  // Moderator login
  async moderatorLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find moderator
    const moderator = await this.prisma.moderator.findUnique({
      where: { email },
    });

    if (!moderator) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if moderator is active
    if (moderator.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, moderator.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update login tracking
    await this.prisma.moderator.update({
      where: { id: moderator.id },
      data: {
        lastLoginAt: new Date(),
        loginCount: moderator.loginCount + 1,
      },
    });

    // Generate JWT
    const token = this.jwtService.sign({
      sub: moderator.id,
      email: moderator.email,
      type: 'moderator',
      role: moderator.role,
    });

    return {
      token,
      moderator: {
        id: moderator.id,
        firstName: moderator.firstName,
        lastName: moderator.lastName,
        email: moderator.email,
        role: moderator.role,
        status: moderator.status,
      },
    };
  }

  // Moderator registration
  async registerModerator(registerModeratorDto: RegisterModeratorDto) {
    // Create the moderator using moderator service
    const moderator =
      await this.moderatorsService.register(registerModeratorDto);

    // Generate JWT token since moderator starts as ACTIVE
    const token = this.jwtService.sign({
      sub: moderator.id,
      email: moderator.email,
      type: 'moderator',
      role: moderator.role,
    });

    return {
      token,
      moderator: {
        id: moderator.id,
        firstName: moderator.firstName,
        lastName: moderator.lastName,
        email: moderator.email,
        role: moderator.role,
        status: moderator.status,
      },
    };
  }

  // Validate moderator from JWT
  async validateModerator(moderatorId: string): Promise<any> {
    const moderator = await this.prisma.moderator.findUnique({
      where: { id: moderatorId },
    });

    if (!moderator || moderator.status !== 'ACTIVE') {
      return null;
    }

    const { password, ...result } = moderator;
    return result;
  }
}
