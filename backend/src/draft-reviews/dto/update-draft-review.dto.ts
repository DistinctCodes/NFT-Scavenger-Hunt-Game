import { PartialType } from '@nestjs/swagger';
import { CreateDraftReviewDto } from './create-draft-review.dto';

export class UpdateDraftReviewDto extends PartialType(CreateDraftReviewDto) {}
