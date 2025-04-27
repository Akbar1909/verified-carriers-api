import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Step 2: Complete user profile (uses authenticated user from token)
  @Patch('complete-profile')
  @UseGuards(UserAuthGuard)
  completeProfile(
    @CurrentUser() user,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.completeProfile(user.id, updateUserDto);
  }

  // Original endpoints

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(UserAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}