import { Controller, Get, Query } from '@nestjs/common';
import { ZipCodeService } from './zip-code.service';

@Controller('zip-codes')
export class ZipCodeController {
  constructor(private readonly zipCodeService: ZipCodeService) {}

  @Get('search')
  async search(@Query('q') q: string) {
    return this.zipCodeService.search(q);
  }
}
