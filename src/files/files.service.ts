import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { File } from '@prisma/client';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async create(fileData: {
    originalName: string;
    filename: string;
    path: string;
    mimeType: string;
    size: number;
  }): Promise<File> {
    return this.prisma.file.create({
      data: fileData,
    });
  }

  async findAll(): Promise<File[]> {
    return this.prisma.file.findMany();
  }

  async findOne(id: string): Promise<File> {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return file;
  }

  async remove(id: string): Promise<File> {
    const file = await this.findOne(id);
    
    return this.prisma.file.delete({
      where: { id },
    });
  }

  // Link a file to a user as profile image
  async linkToUser(fileId: string, userId: string): Promise<File> {
    return this.prisma.file.update({
      where: { id: fileId },
      data: { userId },
    });
  }

  // Link a file to a company logo
  async linkToCompanyLogo(fileId: string, companyLogoId: string): Promise<File> {
    return this.prisma.file.update({
      where: { id: fileId },
      data: { companyLogoId },
    });
  }

  // Link a file to a review photo
  async linkToReviewPhoto(fileId: string, reviewPhotoId: string): Promise<File> {
    return this.prisma.file.update({
      where: { id: fileId },
      data: { reviewPhotoId },
    });
  }
}