import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DraftReviewsService } from './draft-reviews.service';
import { DraftReviewsController } from './draft-reviews.controller';
import { DraftReview } from './entities/draft-review.entity';
import { AuthModule } from '../auth/auth.module';
import { ReviewerGuard } from '../auth/guards/reviewer.guard';
import { PuzzleSubmissionModule } from 'src/puzzle-submission/puzzle-submission.module';
import { PuzzleDraftModule } from 'src/puzzle-draft/puzzle-draft.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DraftReview, PuzzleDraftModule]),
    AuthModule,
    forwardRef(() => PuzzleSubmissionModule),
  ],
  controllers: [DraftReviewsController],
  providers: [DraftReviewsService, ReviewerGuard],
})
export class DraftReviewsModule {}
