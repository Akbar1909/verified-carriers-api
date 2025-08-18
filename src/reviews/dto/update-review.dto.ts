// src/reviews/dto/update-review.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  // Add any fields that aren't in CreateReviewDto but can be updated

  @ApiPropertyOptional({
    description: 'Whether the review has been verified by a moderator',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isVerified must be a boolean' })
  isVerified?: boolean;
}
