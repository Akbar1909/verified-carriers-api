import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be greater than 0' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Size must be an integer' })
  @Min(1, { message: 'Size must be at least 1' })
  @Max(100, { message: 'Size must not exceed 100' })
  size?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term for filtering users by name or email',
    example: 'john@example.com',
  })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort field for ordering results',
    enum: ['name', 'email', 'createdAt', 'updatedAt'],
    default: 'createdAt',
    example: 'createdAt',
  })
  @IsOptional()
  sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt' = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
    example: 'desc',
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Filter by profile status',
    enum: ['INITIAL', 'COMPLETE'],
    example: 'COMPLETE',
  })
  @IsOptional()
  profileStatus?: 'INITIAL' | 'COMPLETE';
}
