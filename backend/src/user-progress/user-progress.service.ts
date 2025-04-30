import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProgress } from './user-progress.entity';
import { UsersService } from 'src/users/users.service';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { HintsService } from 'src/hints/hints.service';
import { LevelService } from 'src/level/level.service';
import { Puzzles } from 'src/puzzles/puzzles.entity';
import { Level } from 'src/level/entities/level.entity';
import { LevelProgressDto } from './dto/level-progress.dto';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
    private readonly userService: UsersService,
    private readonly puzzleService: PuzzlesService,
    private readonly hintService: HintsService,
    private readonly levelService: LevelService
  ) {}

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    const userProgress = await this.userProgressRepository.find({
      where: { user: { id: userId } },
      relations: ['puzzles', 'hints'],
    });

    if (!userProgress.length) {
      throw new NotFoundException(`No progress found for user ${userId}`);
    }

    return userProgress;
  }

  async getUserScore(userId: number): Promise<number> {
    const userProgress = await this.userProgressRepository.find({
      where: { user: { id: userId }, completed: true },
      relations: ['puzzles'],
    });

    return userProgress.reduce((total, p) => total + (p.puzzles?.pointValue || 0), 0);
  }

  async updateProgress(
    userId: number,
    puzzleId: number,
    hintId: number | null,
    completed: boolean,
  ): Promise<UserProgress> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const puzzle = await this.puzzleService.getAPuzzle(puzzleId);
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${puzzleId} not found`);
    }

    let userProgress = await this.userProgressRepository.findOne({
      where: { user: { id: userId }, puzzles: { id: puzzleId } },
      relations: ['user', 'puzzles', 'hints'],
    });

    if (!userProgress) {
      userProgress = this.userProgressRepository.create({
        user,
        puzzles: puzzle,
        completed: false,
        hintsUsed: 0,
      });
    }

    if (hintId) {
      const hint = await this.hintService.findById(hintId.toString());
      if (!hint) {
        throw new NotFoundException(`Hint with ID ${hintId} not found`);
      }
      userProgress.hints = hint;
      userProgress.hintsUsed += 1;
    }

    userProgress.completed = completed;
    userProgress.lastUpdated = new Date();

    return this.userProgressRepository.save(userProgress);
  }

  async puzzleCompleted(
    userId: number,
    puzzleId: number,
  ): Promise<UserProgress> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const puzzle = await this.puzzleService.getAPuzzle(puzzleId);
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${puzzleId} not found`);
    }

    let userProgress = await this.userProgressRepository.findOne({
      where: { user: { id: userId }, puzzles: { id: puzzleId } },
      relations: ['user', 'puzzles'],
    });

    if (!userProgress) {
      userProgress = this.userProgressRepository.create({
        user,
        puzzles: puzzle,
        completed: true,
        lastUpdated: new Date(),
      });
    } else {
      userProgress.completed = true;
      userProgress.lastUpdated = new Date();
    }

    return this.userProgressRepository.save(userProgress);
  }

  async levelCompleted(userId: number, levelId: string): Promise<UserProgress> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const level = await this.levelRepository.findOne({ where: { id: levelId } });
    if (!level) {
      throw new NotFoundException(`Level with ID ${levelId} not found`);
    }

    let userProgress = await this.userProgressRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'completedLevels'],
    });

    if (!userProgress) {
      userProgress = this.userProgressRepository.create({
        user,
        completedLevels: [level],
        lastUpdated: new Date(),
      });
    } else {
      const existingLevel = userProgress.completedLevels.find(l => l.id === levelId);
      if (!existingLevel) {
        userProgress.completedLevels.push(level);
        userProgress.lastUpdated = new Date();
      }
    }

    return this.userProgressRepository.save(userProgress);
  }

  async getLevelProgress(userId: number, levelId: string): Promise<LevelProgressDto> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const level = await this.levelRepository.findOne({
      where: { id: levelId },
      relations: ['puzzles'],
    });
    if (!level) {
      throw new NotFoundException(`Level with ID ${levelId} not found`);
    }

    const puzzleIds = level.puzzles.map(p => p.id);
    const userProgress = await this.userProgressRepository.find({
      where: { user: { id: userId }, completed: true },
      relations: ['puzzles'],
    });

    const solvedPuzzles = userProgress.filter(p => p.puzzles && puzzleIds.includes(p.puzzles.id)).length;
    const totalPuzzles = level.puzzles.length;

  }
}
