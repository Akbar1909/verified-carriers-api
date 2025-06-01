// locations/locations.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationsService, Country, State } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('countries')
  getAllCountries(): Country[] {
    return this.locationsService.getAllCountries();
  }

  @Get('countries/search')
  searchCountries(@Query('q') query: string): Country[] {
    return this.locationsService.searchCountries(query);
  }

  @Get('countries/:code')
  getCountryByCode(@Param('code') code: string): Country | null {
    return this.locationsService.getCountryByCode(code);
  }

  @Get('us-states')
  getAllUsStates(): State[] {
    return this.locationsService.getAllUsStates();
  }

  @Get('us-states/search')
  searchStates(@Query('q') query: string): State[] {
    return this.locationsService.searchStates(query);
  }

  @Get('us-states/:code')
  getStateByCode(@Param('code') code: string): State | null {
    return this.locationsService.getStateByCode(code);
  }
}