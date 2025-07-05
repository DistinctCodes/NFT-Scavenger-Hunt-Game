import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UnlockRuleType {
  PREREQUISITE = 'PREREQUISITE',
  CUSTOM = 'CUSTOM',
}

@Entity('unlock_rules')
export class UnlockRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'target_puzzle_id' })
  targetPuzzleId: string;

  @Column({ name: 'prerequisite_puzzle_id', nullable: true })
  prerequisitePuzzleId: string | null;

  @Column({
    type: 'enum',
    enum: UnlockRuleType,
    default: UnlockRuleType.PREREQUISITE,
  })
  type: UnlockRuleType;

  @Column({ name: 'custom_condition', type: 'jsonb', nullable: true })
  customCondition?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Helper method to check if this rule is satisfied by completed puzzle IDs
  isSatisfiedBy(completedPuzzleIds: string[]): boolean {
    if (this.type === UnlockRuleType.PREREQUISITE) {
      return completedPuzzleIds.includes(this.prerequisitePuzzleId);
    }
    // For custom rules, we would evaluate the custom condition here
    // This is a placeholder for custom rule evaluation
    return false;
  }
}
