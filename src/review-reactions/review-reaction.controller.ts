import { Controller, Post, Param, Body, Get, UseGuards } from '@nestjs/common';
import { ReviewReactionService } from './review-reaction.service';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('reviews/:reviewId/like')
export class ReviewReactionController {
  constructor(private readonly service: ReviewReactionService) {}

  // Toggle like
  @Post()
  @UseGuards(UserAuthGuard)
  async toggleLike(
    @Param('reviewId') reviewId: string,
    @CurrentUser('userId') user,
  ) {
    return this.service.toggleLike(user.id, reviewId);
  }

  // Get like count
  @Get()
  async getLikeCount(@Param('reviewId') reviewId: string) {
    const likeCount = await this.service.getLikeCount(reviewId);
    return { reviewId, likeCount };
  }

  // Check if a user already liked this review
  @Get(':userId')
  async userLiked(
    @Param('reviewId') reviewId: string,
    @Param('userId') userId: string,
  ) {
    const liked = await this.service.userLiked(userId, reviewId);
    return { reviewId, userId, liked };
  }
}
