import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user-inventory/entities/user';
import { DraftPuzzle } from 'src/puzzle-draft/entities/draft-puzzle.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('draft_reviews')
export class DraftReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DraftPuzzle)
  @JoinColumn({ name: 'draft_id' })
  draft: DraftPuzzle;

  @Column({ name: 'draft_id' })
  draftId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @Column({ name: 'reviewer_id' })
  reviewerId: string;

  @Column('text', { nullable: true })
  feedback: string;

  @Column({ type: 'enum', enum: ReviewStatus })
  status: ReviewStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
