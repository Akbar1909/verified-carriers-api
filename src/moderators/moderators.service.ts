import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterModeratorDto } from './dto/register-moderator.dto';
import { UpdateModeratorDto } from './dto/update-moderator.dto';
import { ModeratorRole, ModeratorStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ModeratorsService {
  constructor(private prisma: PrismaService) {}

  async register(registerModeratorDto: RegisterModeratorDto) {
    const { email, password, firstName, lastName } = registerModeratorDto;

    console.log({email, password})

    // Check if moderator already exists
    const existingModerator = await this.prisma.moderator.findUnique({
      where: { email },
    });

    if (existingModerator) {
      throw new BadRequestException('Moderator with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create moderator with PENDING status
    const moderator = await this.prisma.moderator.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        status: ModeratorStatus.ACTIVE,
        role: ModeratorRole.CONTENT_MOD, // Default role
      },
    });

    // Remove password from response
    const { password: _, ...result } = moderator;
    return result;
  }

  async findAll() {
    return this.prisma.moderator.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        loginCount: true,
      },
    });
  }

  async findOne(id: string) {
    const moderator = await this.prisma.moderator.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        loginCount: true,
        verifiedCompanies: {
          select: {
            id: true,
            name: true,
            verifiedAt: true,
          },
        },
        moderatedReviews: {
          select: {
            id: true,
            moderatedAt: true,
            moderationReason: true,
          },
        },
      },
    });

    if (!moderator) {
      throw new NotFoundException('Moderator not found');
    }

    return moderator;
  }

  async update(id: string, updateModeratorDto: UpdateModeratorDto) {
    const moderator = await this.prisma.moderator.findUnique({
      where: { id },
    });

    if (!moderator) {
      throw new NotFoundException('Moderator not found');
    }

    const updatedModerator = await this.prisma.moderator.update({
      where: { id },
      data: updateModeratorDto,
    });

    const { password, ...result } = updatedModerator;
    return result;
  }

  async approveModerator(id: string) {
    return this.update(id, { status: ModeratorStatus.ACTIVE });
  }

  async rejectModerator(id: string) {
    return this.update(id, { status: ModeratorStatus.INACTIVE });
  }

  async suspendModerator(id: string) {
    return this.update(id, { status: ModeratorStatus.SUSPENDED });
  }

  async remove(id: string) {
    const moderator = await this.prisma.moderator.findUnique({
      where: { id },
    });

    if (!moderator) {
      throw new NotFoundException('Moderator not found');
    }

    await this.prisma.moderator.delete({
      where: { id },
    });

    return { message: 'Moderator deleted successfully' };
  }
}
