import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCarMakeDto } from './dto/create-car-make.dto';
import { CreateCarModelDto } from './dto/create-car-model.dto';

@Injectable()
export class CarService {
  constructor(private prisma: PrismaService) {}

  createCarMake(dto: CreateCarMakeDto) {
    return this.prisma.carMake.create({ data: dto });
  }

  createCarModel(dto: CreateCarModelDto) {
    return this.prisma.carModel.create({ data: dto });
  }

  getAllCarMakes(search?: string) {
    if (!search) {
      return [];
    }

    return this.prisma.carMake.findMany({
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined,
    });
  }

  getAllCarModels(search?: string) {
    if (!search) {
      return [];
    }

    return this.prisma.carModel.findMany({
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined,
    });
  }

  getModelsByMakeId(makeId: number, search?: string) {
    return this.prisma.carModel.findMany({
      where: {
        makeId,

        ...(search && {
          name: { contains: search, mode: 'insensitive' },
        }),
      },
    });
  }
}
