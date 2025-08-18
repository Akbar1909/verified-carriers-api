// src/reviews/review.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { FilterReviewDto } from './dto/filter-review.dto';
import { VerifyReviewDto, PublishReviewDto } from './dto/moderation-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserAuthGuard } from 'src/auth/guards/user-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ModeratorGuard } from 'src/auth/guards/moderator.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('reviews')
@Controller('reviews')
@UseInterceptors(ClassSerializerInterceptor)
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The review has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Referenced user or company not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  create(@CurrentUser() user, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(user.id, createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a paginated list of reviews',
  })
  findAll(@Query() filters: FilterReviewDto, @Req() req: Request) {
    let userId: string | undefined;

    // check if auth header present
    const authHeader = req.headers['authorization'];


    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        }); // 👈 decode token
        userId = payload.sub; // or payload.id depending on your JWT
      } catch (err) {
        console.log({ err });
        // invalid token → just ignore, leave userId undefined
      }
    }

    return this.reviewService.findAll(filters, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the review with the specified ID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found',
  })
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The review has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  update(
    @CurrentUser() user,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(user.id, id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The review has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }

  @Patch(':id/verify')
  @UseGuards(ModeratorGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiBody({ type: VerifyReviewDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The review has been successfully verified.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  verifyReview(@Param('id') id: string) {
    return this.reviewService.verifyReview(id);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish or unpublish a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiBody({ type: PublishReviewDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The review publication status has been updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Review not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  publishReview(@Param('id') id: string, @Body() publishDto: PublishReviewDto) {
    return this.reviewService.publishReview(id, publishDto);
  }
}
