import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ModeratorRole, ModeratorStatus } from '@prisma/client';

export class UpdateModeratorDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(ModeratorRole)
  role?: ModeratorRole;

  @IsOptional()
  @IsEnum(ModeratorStatus)
  status?: ModeratorStatus;
}
