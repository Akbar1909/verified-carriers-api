import {
  IsOptional,
  IsInt,
  Min,
  IsArray,
  ArrayUnique,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterCompanyDto {
  @ApiPropertyOptional({
    description: 'Filter by minimum years of experience',
    example: 3,
    enum: [1, 3, 5, 7, 10],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  experience?: number;

  @ApiPropertyOptional({
    description: 'Filter companies by services',
    type: [String],
    example: ['uuid1', 'uuid2', 'uuid3'],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsString({ each: true }) // Validate each item is a string
  serviceIds?: string[];

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size?: number = 10;
}
