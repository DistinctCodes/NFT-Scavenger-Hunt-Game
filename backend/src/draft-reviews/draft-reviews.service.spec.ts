import { Test, TestingModule } from '@nestjs/testing';
import { DraftReviewsService } from './draft-reviews.service';

describe('DraftReviewsService', () => {
  let service: DraftReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DraftReviewsService],
    }).compile();

    service = module.get<DraftReviewsService>(DraftReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
