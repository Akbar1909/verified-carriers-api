import {
  IsOptional,
  IsInt,
  Min,
  IsArray,
  ArrayUnique,
  ArrayNotEmpty,
  IsString,
  IsBoolean,
  IsDecimal,
  IsIn,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
    description: 'Filter by ratings (allowed values: 3, 3.5, 4, 4.5)',
    type: [Number],
    example: [3.5, 4],
    enum: [3, 3.5, 4, 4.5],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn([3, 3.5, 4, 4.5], { each: true }) // restrict values
  @Type(() => Number)
  rating?: number[];

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

  @ApiPropertyOptional({
    description: 'Filter only top rated companies',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  topRated?: boolean;

  @ApiPropertyOptional({
    description: 'Sort companies by most reviewed (highest review count)',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  mostReviewed?: boolean;

  @ApiPropertyOptional({
    description: 'Show only companies created within the last 7 days',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isNew?: boolean;

  @ApiPropertyOptional({
    description: 'Show only companies verified',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Sort companies by field',
    example: 'highlyRated',
    enum: [
      'relevancy',
      'highlyRated',
      'mostReviewed',
      'experience',
      'verifiedFirst',
    ],
  })
  @IsOptional()
  @IsString()
  sortBy?:
    | 'relevancy'
    | 'highlyRated'
    | 'mostReviewed'
    | 'experience'
    | 'verifiedFirst';

  @ApiHideProperty() // 🚀 Hide from Swagger docs
  @IsOptional()
  @IsUUID()
  userId?: string; // injected in controller, not by client
}
