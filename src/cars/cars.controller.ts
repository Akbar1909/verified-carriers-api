import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CarService } from './cars.service';
import { CreateCarMakeDto } from './dto/create-car-make.dto';
import { CreateCarModelDto } from './dto/create-car-model.dto';

@Controller('cars')
export class CarController {
  constructor(private carService: CarService) {}

  @Post('make')
  createCarMake(@Body() dto: CreateCarMakeDto) {
    return this.carService.createCarMake(dto);
  }

  @Post('model')
  createCarModel(@Body() dto: CreateCarModelDto) {
    return this.carService.createCarModel(dto);
  }

  @Get('make')
  getAllMakes(@Query('search') search?: string) {
    return this.carService.getAllCarMakes(search);
  }

  @Get('model')
  getAllModels(@Query('search') search?: string) {
    return this.carService.getAllCarModels(search);
  }

  @Get('make/:makeId/models')
  getModelsByMakeId(
    @Param('makeId') makeId: string,
    @Query('search') search?: string,
  ) {
    return this.carService.getModelsByMakeId(Number(makeId), search);
  }
}
