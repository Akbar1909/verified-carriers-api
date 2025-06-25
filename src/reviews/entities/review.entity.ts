// src/reviews/entities/review.entity.ts
import { Review, Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';

export class ReviewEntity implements Review {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  reviewText: string;
  pickupState: string | null;
  deliveryState: string | null;
  deliveryDate: Date | null;

  @Transform(({ value }) => {
    if (value === null) return null;
    return value instanceof Prisma.Decimal ? value.toNumber() : value;
  })
  transportationPrice: Prisma.Decimal | null;

  isVerified: boolean;
  shipmentType: string | null;
  isPublished: boolean;
  moderatedAt: Date | null;
  moderatedBy: string | null;
  moderatedById: string | null;
  moderationReason: string | null;
  userId: string;
  companyId: string;

  constructor(partial: Partial<ReviewEntity>) {
    Object.assign(this, partial);
  }
}
