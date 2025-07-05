import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnlockRule } from './entities/unlock-rule.entity';
import { CreateUnlockRuleDto } from './dto/create-unlock-rule.dto';
import { UserProgressService } from '../user-progress/user-progress.service';
import { UnlockablePuzzlesDto } from './dto/unlockable-puzzles.dto';

@Injectable()
export class PuzzleUnlockService {
  constructor(
    @InjectRepository(UnlockRule)
    private readonly unlockRuleRepository: Repository<UnlockRule>,
    private readonly userProgressService: UserProgressService,
  ) {}

  /**
   * Create a new unlock rule
   */
  async createRule(createUnlockRuleDto: CreateUnlockRuleDto): Promise<UnlockRule> {
    const rule = this.unlockRuleRepository.create(createUnlockRuleDto);
    return this.unlockRuleRepository.save(rule);
  }

  /**
   * Get all unlock rules
   */
  async findAllRules(): Promise<UnlockRule[]> {
    return this.unlockRuleRepository.find();
  }

  /**
   * Get unlock rules for a specific puzzle
   */
  async findRulesForPuzzle(puzzleId: string): Promise<UnlockRule[]> {
    return this.unlockRuleRepository.find({
      where: { targetPuzzleId: puzzleId },
    });
  }

  /**
   * Get all unlockable puzzle IDs for a user
   */
  async getUnlockablePuzzleIds(userId: number): Promise<UnlockablePuzzlesDto> {
    // Get all completed puzzle IDs for the user
    const userProgress = await this.userProgressService.getUserProgress(userId);
    const completedPuzzleIds = userProgress
      .filter(up => up.completed && up.puzzles?.id)
      .map(up => up.puzzles.id.toString());

    // Get all unlock rules
    const allRules = await this.unlockRuleRepository.find();

    // Find all puzzles that have their unlock conditions met
    const unlockablePuzzleIds = allRules
      .filter(rule => rule.isSatisfiedBy(completedPuzzleIds))
      .map(rule => rule.targetPuzzleId);

    // Remove duplicates
    const uniquePuzzleIds = [...new Set(unlockablePuzzleIds)];

    // Filter out puzzles the user has already completed
    const newUnlockablePuzzleIds = uniquePuzzleIds.filter(
      id => !completedPuzzleIds.includes(id)
    );

    return new UnlockablePuzzlesDto(newUnlockablePuzzleIds);
  }

  /**
   * Check if a specific puzzle can be unlocked by a user
   */
  async canUnlockPuzzle(
    userId: number,
    targetPuzzleId: string,
  ): Promise<boolean> {
    const unlockablePuzzles = await this.getUnlockablePuzzleIds(userId);
    return unlockablePuzzles.unlockablePuzzleIds.includes(targetPuzzleId);
  }

  /**
   * Delete an unlock rule by ID
   */
  async deleteRule(id: string): Promise<void> {
    const result = await this.unlockRuleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Unlock rule with ID "${id}" not found`);
    }
  }
}
