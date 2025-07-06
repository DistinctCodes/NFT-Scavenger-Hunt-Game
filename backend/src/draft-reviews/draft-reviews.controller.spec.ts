import { Test, TestingModule } from '@nestjs/testing';
import { DraftReviewsController } from './draft-reviews.controller';
import { DraftReviewsService } from './draft-reviews.service';

describe('DraftReviewsController', () => {
  let controller: DraftReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DraftReviewsController],
      providers: [DraftReviewsService],
    }).compile();

    controller = module.get<DraftReviewsController>(DraftReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
