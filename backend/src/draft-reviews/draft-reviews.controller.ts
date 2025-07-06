import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DraftReviewsService } from './draft-reviews.service';
import { ReviewerGuard } from '../auth/guards/reviewer.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateReviewDto } from 'src/puzzle-review/puzzle-review/interfaces/review.interface';

@Controller('drafts')
export class DraftReviewsController {
  constructor(private readonly draftReviewsService: DraftReviewsService) {}

  @UseGuards(ReviewerGuard)
  @Post(':id/review')
  submitReview(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req,
  ) {
    const reviewerId = req.user.userId;
    return this.draftReviewsService.submitOrUpdateReview(
      id,
      reviewerId,
      createReviewDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('review-pending')
  getPendingDrafts() {
    return this.draftReviewsService.findPendingReviewDrafts();
  }
}
