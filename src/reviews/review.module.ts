// src/reviews/review.module.ts
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}