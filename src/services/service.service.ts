import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Service } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateServiceDto) {
    return await this.prisma.service.create({ data });
  }

  async findAll() {
    return await this.prisma.service.findMany();
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: string, data: Prisma.ServiceUpdateInput) {
    return  await this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.service.delete({
      where: { id },
    });
  }
}
