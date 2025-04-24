import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilesService } from '../files/files.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { imageId, ...userData } = createUserDto;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    try {
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
      
      // Link image if provided
      if (imageId) {
        await this.filesService.linkToUser(imageId, user.id);
      }
      
      // Get user with image
      return this.findOne(user.id);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        visibleName: true,
        phoneNumber: true,
        contactEmail: true,
        country: true,
        state: true,
        bio: true,
        twitter: true,
        linkedin: true,
        facebook: true,
        createdAt: true,
        updatedAt: true,
        image: {
          select: {
            id: true,
            originalName: true,
            path: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        image: {
          select: {
            id: true,
            originalName: true,
            path: true,
          },
        },
        reviews: {
          include: {
            photos: {
              include: {
                file: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    await this.findOne(id);
    
    const { imageId, ...userData } = updateUserDto;
    
    // Hash password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Update user data
    await this.prisma.user.update({
      where: { id },
      data: userData,
    });
    
    // Update image relation if provided
    if (imageId) {
      await this.filesService.linkToUser(imageId, id);
    }
    
    // Return updated user
    return this.findOne(id);
  }

  async remove(id: string) {
    // Check if user exists
    await this.findOne(id);
    
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    
    return user;
  }
}
