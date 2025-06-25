import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ModeratorsService } from './moderators.service';
import { RegisterModeratorDto } from './dto/register-moderator.dto';
import { UpdateModeratorDto } from './dto/update-moderator.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModeratorGuard } from '../auth/guards/moderator.guard';

@Controller('moderators')
export class ModeratorsController {
  constructor(private readonly moderatorsService: ModeratorsService) {}

  @Post('register')
  register(@Body() registerModeratorDto: RegisterModeratorDto) {
    return this.moderatorsService.register(registerModeratorDto);
  }

  @UseGuards(JwtAuthGuard, ModeratorGuard)
  @Get()
  findAll() {
    return this.moderatorsService.findAll();
  }

  @UseGuards(JwtAuthGuard, ModeratorGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moderatorsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, ModeratorGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModeratorDto: UpdateModeratorDto,
  ) {
    return this.moderatorsService.update(id, updateModeratorDto);
  }

  @UseGuards(JwtAuthGuard, ModeratorGuard)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.moderatorsService.approveModerator(id);
  }

  @UseGuards(JwtAuthGuard, ModeratorGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.moderatorsService.rejectModerator(id);
  }

  @UseGuards(JwtAuthGuard, ModeratorGuard)
  @Patch(':id/suspend')
  suspend(@Param('id') id: string) {
    return this.moderatorsService.suspendModerator(id);
  }

  @UseGuards(JwtAuthGuard, ModeratorGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moderatorsService.remove(id);
  }
}
