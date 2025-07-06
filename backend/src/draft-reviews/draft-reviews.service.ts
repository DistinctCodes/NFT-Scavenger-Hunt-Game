import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DraftReview, ReviewStatus } from './entities/draft-review.entity';
import { PuzzleService } from 'src/puzzle/puzzle.service';
import {
  DraftPuzzle,
  DraftStatus,
} from 'src/puzzle-draft/entities/draft-puzzle.entity';
import { CreateReviewDto } from 'src/puzzle-review/puzzle-review/interfaces/review.interface';

@Injectable()
export class DraftReviewsService {
  constructor(
    @InjectRepository(DraftReview)
    private readonly reviewRepository: Repository<DraftReview>,
    @InjectRepository(DraftPuzzle)
    private readonly draftRepository: Repository<DraftPuzzle>,
    @Inject(forwardRef(() => PuzzleService))
    private readonly puzzlesService: PuzzleService,
  ) {}

  async submitOrUpdateReview(
    draftId: string,
    reviewerId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<DraftReview> {
    const draft = await this.draftRepository.findOneBy({ id: draftId });
    if (!draft) {
      throw new NotFoundException(`Draft with ID "${draftId}" not found.`);
    }
    if (draft.status !== DraftStatus.IN_REVIEW) {
      throw new BadRequestException(`Draft is not in review status.`);
    }

    // Create or update the review
    let review = await this.reviewRepository.findOne({
      where: { draftId, reviewerId },
    });
    if (review) {
      review.status = createReviewDto.status;
      review.feedback = createReviewDto.feedback;
    } else {
      review = this.reviewRepository.create({
        ...createReviewDto,
        draftId,
        reviewerId,
      });
    }
    await this.reviewRepository.save(review);

    // Handle status transition
    if (createReviewDto.status === ReviewStatus.APPROVED) {
      draft.status = DraftStatus.APPROVED;
      // On approval, create a new puzzle in the main table
      await this.puzzlesService.create({
        title: draft.title,
        description: draft.description,
        question: draft.question,
        solution: draft.solution,
      });
    } else if (createReviewDto.status === ReviewStatus.REJECTED) {
      draft.status = DraftStatus.REJECTED;
    }
    await this.draftRepository.save(draft);

    return review;
  }

  async findPendingReviewDrafts(): Promise<DraftPuzzle[]> {
    return this.draftRepository.find({
      where: { status: DraftStatus.IN_REVIEW },
      relations: ['author'],
    });
  }
}
