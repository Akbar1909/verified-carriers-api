import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { FindAllDto } from './dto/find-all.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async me(userId: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = await this.prisma.user.findUnique({
        where: { id: userId },
        include:{
          image:true
        }
      });
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('User with email not found');
      }

      throw Error;
    }
  }

  // Step 1: Initial user registration with basic info
  async register(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Create the user with minimal information
      const user = await this.prisma.user.create({
        data: {
          name,
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
    const dataToUpdate = {
      ...userData,
      profileStatus: 'COMPLETE', // Update the status with the enum value
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

  async findAll(findAllDto: FindAllDto) {
    const { page, size, search, sortBy, sortOrder, profileStatus } = findAllDto;

    // Ensure page and size are numbers
    const pageNumber = Number(page) || 1;
    const sizeNumber = Number(size) || 10;

    // Validate converted numbers
    if (pageNumber < 1) {
      throw new BadRequestException('Page must be greater than 0');
    }
    if (sizeNumber < 1 || sizeNumber > 100) {
      throw new BadRequestException('Size must be between 1 and 100');
    }

    // Calculate skip value for pagination
    const skip = (pageNumber - 1) * sizeNumber;

    // Build where clause for filtering
    const where: any = {};

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add profile status filter
    if (profileStatus) {
      where.profileStatus = profileStatus;
    }

    // Get total count for pagination metadata
    const totalCount = await this.prisma.user.count({ where });

    // Build orderBy clause
    const orderBy = { [sortBy]: sortOrder };

    // Get paginated users
    const users = await this.prisma.user.findMany({
      skip,
      take: sizeNumber,
      where,
      orderBy,
      include: {
        image: true,
      },
    });

    // Remove sensitive information
    const safeUsers = users.map((user) => {
      const { password, ...result } = user;
      return result;
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / sizeNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPreviousPage = pageNumber > 1;

    return {
      data: safeUsers,
      pagination: {
        page: pageNumber,
        size: sizeNumber,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
      filters: {
        search,
        profileStatus,
        sortBy,
        sortOrder,
      },
    };
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
