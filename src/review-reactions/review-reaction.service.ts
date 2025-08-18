import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewReactionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Toggle like/unlike for a review.
   * If user already liked → remove like (count down).
   * If not liked → add like (count up).
   */
  async toggleLike(userId: string, reviewId: string) {
    // Check if review exists
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException(`Review ${reviewId} not found`);

    // Check if user already liked
    const existing = await this.prisma.reviewReaction.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });

    if (existing) {
      // 👎 remove like
      await this.prisma.reviewReaction.delete({
        where: { userId_reviewId: { userId, reviewId } },
      });
      const count = await this.prisma.reviewReaction.count({
        where: { reviewId },
      });
      return { liked: false, likeCount: count };
    }

    // 👍 add like
    await this.prisma.reviewReaction.create({
      data: { userId, reviewId },
    });
    const count = await this.prisma.reviewReaction.count({
      where: { reviewId },
    });
    return { liked: true, likeCount: count };
  }

  /**
   * Get how many likes a review has
   */
  async getLikeCount(reviewId: string) {
    return this.prisma.reviewReaction.count({ where: { reviewId } });
  }

  /**
   * Check if user already liked a review
   */
  async userLiked(userId: string, reviewId: string) {
    const existing = await this.prisma.reviewReaction.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });
    return !!existing;
  }
}
