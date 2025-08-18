// src/reviews/dto/moderation.dto.ts
import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyReviewDto {
  @ApiProperty({
    description: 'ID of the moderator who verified the review',
    example: 'clfg5d8b30003jz0g9s3z1r8q',
  })
  @IsString({ message: 'Moderator ID must be a string' })
  moderatorId: string;

  @ApiPropertyOptional({
    description: 'Optional comments by the moderator',
    example: 'Verified after checking shipping documentation',
  })
  @IsOptional()
  @IsString({ message: 'Moderator comments must be a string' })
  moderatorComments?: string;
}

export class PublishReviewDto {
  @ApiProperty({
    description: 'Whether the review should be published or unpublished',
    example: true,
  })
  @IsBoolean({ message: 'isPublished must be a boolean' })
  isPublished: boolean;

  @ApiPropertyOptional({
    description: 'Reason for publishing or unpublishing the review',
    example: 'Unpublished due to inappropriate content',
  })
  @IsOptional()
  @IsString({ message: 'Reason must be a string' })
  reason?: string;
}
