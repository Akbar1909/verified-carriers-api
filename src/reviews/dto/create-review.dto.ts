// src/reviews/dto/create-review.dto.ts
import {
  IsInt,
  IsString,
  IsOptional,
  IsDate,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  Length,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Rating score from 1 to 5',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number;

  @ApiProperty({
    description: 'Detailed review text',
    example:
      'This trucking company provided excellent service. The shipment arrived on time and in perfect condition.',
  })
  @IsString({ message: 'Review text must be a string' })
  @Length(10, 5000, {
    message: 'Review text must be between 10 and 5000 characters',
  })
  reviewText: string;

  @ApiPropertyOptional({
    description: 'State where the shipment was picked up',
    example: 'California',
  })
  @IsOptional()
  @IsString({ message: 'Pickup state must be a string' })
  pickupState?: string;

  @ApiPropertyOptional({
    description: 'State where the shipment was delivered',
    example: 'Texas',
  })
  @IsOptional()
  @IsString({ message: 'Delivery state must be a string' })
  deliveryState?: string;

  
  @IsString({ message: 'Order id' })
  orderId: string;

  @ApiPropertyOptional({
    description: 'Date when the shipment was delivered',
    type: Date,
    example: '2025-03-15T00:00:00Z',
  })
  @IsOptional()
  @IsDate({ message: 'Delivery date must be a valid date' })
  @Type(() => Date)
  deliveryDate?: Date;

  @ApiPropertyOptional({
    description: 'Price paid for transportation',
    example: 1250.75,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Transportation price must be a number with up to 2 decimal places',
    },
  )
  @Type(() => Number)
  transportationPrice?: number;

  @ApiPropertyOptional({
    description: 'Type of shipment transported',
    example: 'Refrigerated goods',
  })
  @IsOptional()
  @IsString({ message: 'Shipment type must be a string' })
  shipmentType?: string;

  @ApiPropertyOptional({
    description: 'Whether the review should be publicly visible',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublished must be a boolean' })
  isPublished?: boolean = true;

  @ApiProperty({
    description: 'ID of the company being reviewed',
    example: 'clfg5d8b30001jz0g9s3z1r8q',
  })
  @IsString({ message: 'Company ID must be a string' })
  companyId: string;

  @IsOptional()
  @IsUUID()
  fileIds?: string[];
}
