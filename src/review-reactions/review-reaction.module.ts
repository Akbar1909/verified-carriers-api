import { Module } from '@nestjs/common';
import { ReviewReactionService } from './review-reaction.service';
import { ReviewReactionController } from './review-reaction.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ReviewReactionController],
  providers: [ReviewReactionService, PrismaService],
})
export class ReviewReactionModule {}
