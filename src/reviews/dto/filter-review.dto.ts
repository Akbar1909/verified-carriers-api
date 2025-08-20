// src/reviews/dto/filter-review.dto.ts
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterReviewDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 50,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(50, { message: 'Limit must be at most 50' })
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: 'clfg5d8b30000jz0g9s3z1r8q',
  })
  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by company ID',
    example: 'clfg5d8b30001jz0g9s3z1r8q',
  })
  @IsOptional()
  @IsString({ message: 'Company ID must be a string' })
  companyId?: string;

  @ApiPropertyOptional({
    description: 'Filter by rating (1-5)',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsOptional()
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  @Type(() => Number)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Filter by shipment type',
    example: 'Refrigerated',
  })
  @IsOptional()
  @IsString({ message: 'Shipment type must be a string' })
  shipmentType?: string;

  @ApiPropertyOptional({
    description: 'Filter by pickup state',
    example: 'California',
  })
  @IsOptional()
  @IsString({ message: 'Pickup state must be a string' })
  pickupState?: string;

  @ApiPropertyOptional({
    description: 'Filter by delivery state',
    example: 'Texas',
  })
  @IsOptional()
  @IsString({ message: 'Delivery state must be a string' })
  deliveryState?: string;

  @ApiPropertyOptional({
    description: 'Filter by verification status',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isVerified must be a boolean' })
  @Type(() => Boolean)
  isVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by publication status',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublished must be a boolean' })
  @Type(() => Boolean)
  isPublished?: boolean;
}
