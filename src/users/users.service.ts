import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

// Step 1: Initial user registration with basic info
async register(registerUserDto: RegisterUserDto) {
  const { firstName, lastName, email, password } = registerUserDto;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // Create the user with minimal information
    const user = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        profileStatus: 'INITIAL', // Set initial status
      },
    });
    
    // Return user without sensitive information
    const { password: _, ...result } = user;
    return result;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new BadRequestException('User with this email already exists');
    }
    throw error;
  }
}

// Step 2: Complete user profile with additional information
async completeProfile(id: string, updateUserDto: UpdateUserDto) {
  // Check if user exists
  await this.findOne(id);
  
  const { fileId, ...userData } = updateUserDto;
  
  // Create data update object without password
  let dataToUpdate = { 
    ...userData,
    profileStatus: 'COMPLETE' // Update the status with the enum value
  };
  
  
  // Update user basic info
  await this.prisma.user.update({
    where: { id },
    // @ts-expect-error
    data: dataToUpdate,
  });
  
  // Add profile image if provided
  if (fileId) {
    await this.filesService.linkToUserProfile(fileId, id);
  }
  
  // Return updated user
  return this.findOne(id);
}

  async create(createUserDto: CreateUserDto) {
    const { fileId, ...userData } = createUserDto;
    
    // Hash password
    userData.password = await bcrypt.hash(userData.password, 10);
    
    try {
      // Create the user
      const user = await this.prisma.user.create({
        data: userData,
      });
      
      // Link profile image if provided
      if (fileId) {
        await this.filesService.linkToUserProfile(fileId, user.id);
      }
      
      // Return user without sensitive information
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('User with this email already exists');
      }
      throw error;
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        image: true,
        reviews: true,
      },
    });
    
    // Remove sensitive information
    return users.map(user => {
      const { password, ...result } = user;
      return result;
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        image: true,
        reviews: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
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

    // Remove sensitive information
    const { password, ...result } = user;
    return result;
  }

  // Find user by email
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Remove sensitive information
    const { password, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    await this.findOne(id);
    
    const { fileId, ...userData } = updateUserDto;
    
    // Hash password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    } else {
      // Remove password field if not provided
      delete userData.password;
    }
    
    // Update user basic info
    await this.prisma.user.update({
      where: { id },
      data: userData,
    });
    
    // Update profile image if provided
    if (fileId) {
      await this.filesService.linkToUserProfile(fileId, id);
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
}