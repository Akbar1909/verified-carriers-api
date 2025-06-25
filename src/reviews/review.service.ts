// src/reviews/review.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilterReviewDto } from './dto/filter-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { VerifyReviewDto, PublishReviewDto } from './dto/moderation-review.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private fileService: FilesService,
  ) {}

  async create(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewEntity> {
    try {
      // Verify that the user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${user.id} not found`);
      }

      // Verify that the company exists
      const company = await this.prisma.company.findUnique({
        where: { id: createReviewDto.companyId },
      });

      if (!company) {
        throw new NotFoundException(
          `Company with ID ${createReviewDto.companyId} not found`,
        );
      }

      const { fileIds, ...reviewDto } = createReviewDto;

      const review = await this.prisma.review.create({
        data: {
          ...reviewDto,
          userId: user.id,
        },
        include:{
            photos:true
        }
      });

      if (fileIds && fileIds.length > 0) {
        for (const fileId of fileIds) {
          const reviewPhoto = await this.prisma.reviewPhoto.create({
            data: {
              reviewId: review.id,
              file:{
                connect:{
                    id:fileId
                }
              }
            },
          });

          await this.fileService.linkToReviewPhoto(fileId, reviewPhoto.id);
        }
      }

      return new ReviewEntity(review)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'A review with these unique constraints already exists',
        );
      }
      throw new BadRequestException(
        `Failed to create review: ${error.message}`,
      );
    }
  }

  async findAll(filters: FilterReviewDto): Promise<{
    data: ReviewEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, ...otherFilters } = filters;
    const skip = (page - 1) * limit;

    // Prepare filters
    const where: any = {};

    if (otherFilters.userId) {
      where.userId = otherFilters.userId;
    }

    if (otherFilters.companyId) {
      where.companyId = otherFilters.companyId;
    }

    if (otherFilters.rating) {
      where.rating = otherFilters.rating;
    }

    if (otherFilters.shipmentType) {
      where.shipmentType = otherFilters.shipmentType;
    }

    if (otherFilters.pickupState) {
      where.pickupState = otherFilters.pickupState;
    }

    if (otherFilters.deliveryState) {
      where.deliveryState = otherFilters.deliveryState;
    }

    if (otherFilters.isVerified !== undefined) {
      where.isVerified = otherFilters.isVerified;
    }

    if (otherFilters.isPublished !== undefined) {
      where.isPublished = otherFilters.isPublished;
    }

    try {
      // Query for reviews with pagination
      const [reviews, total] = await Promise.all([
        this.prisma.review.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            photos: {
              include: {
                file: true,
              },
            },
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                visibleName: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        this.prisma.review.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      // Transform to entities
      const reviewEntities = reviews.map((review) => new ReviewEntity(review));

      return {
        data: reviewEntities,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch reviews: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<ReviewEntity> {
    try {
      const review = await this.prisma.review.findUnique({
        where: { id },
        include: {
          photos: {
            include: {
              file: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              visibleName: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }

      return new ReviewEntity(review);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch review: ${error.message}`);
    }
  }

  async update(
    userId: string,
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewEntity> {
    try {
      // Check if review exists
      await this.findOne(id);

      // If updating user or company references, verify they exist
      if (userId) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
      }

      if (updateReviewDto.companyId) {
        const company = await this.prisma.company.findUnique({
          where: { id: updateReviewDto.companyId },
        });

        if (!company) {
          throw new NotFoundException(
            `Company with ID ${updateReviewDto.companyId} not found`,
          );
        }
      }

      const updatedReview = await this.prisma.review.update({
        where: { id },
        data: updateReviewDto,
      });

      return new ReviewEntity(updatedReview);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update review: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<ReviewEntity> {
    try {
      // Check if review exists
      await this.findOne(id);

      const deletedReview = await this.prisma.review.delete({
        where: { id },
      });

      return new ReviewEntity(deletedReview);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete review: ${error.message}`,
      );
    }
  }

  async verifyReview(
    id: string,
    verifyDto: VerifyReviewDto,
  ): Promise<ReviewEntity> {
    try {
      // Check if review exists
      await this.findOne(id);

      const verifiedReview = await this.prisma.review.update({
        where: { id },
        data: {
          isVerified: true,
          moderatedAt: new Date(),
         
        },
      });

      return new ReviewEntity(verifiedReview);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to verify review: ${error.message}`,
      );
    }
  }

  async publishReview(
    id: string,
    publishDto: PublishReviewDto,
  ): Promise<ReviewEntity> {
    try {
      // Check if review exists
      await this.findOne(id);

      const updatedReview = await this.prisma.review.update({
        where: { id },
        data: {
          isPublished: publishDto.isPublished,
          moderatedAt: new Date(),
        },
      });

      return new ReviewEntity(updatedReview);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update publication status: ${error.message}`,
      );
    }
  }
}
