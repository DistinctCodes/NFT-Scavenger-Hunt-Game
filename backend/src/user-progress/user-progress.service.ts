import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import type { Hints } from "../hints/hints.entity"
import { UserProgress } from "./user-progress.entity"
import { UsersService } from "src/users/users.service"
import { PuzzlesService } from "src/puzzles/puzzles.service"
import { HintsService } from "src/hints/hints.service"

@Injectable()
export class UserProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,

    //define dependency injection for user service
    private readonly userservice: UsersService,

    //define dependency injection for puzzle service
    private readonly puzzleservice: PuzzlesService,

    //define dependency injection for hint service
    private readonly hintservice: HintsService,

  ) {}

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return this.userProgressRepository.find({
      where: { user: { id: userId } },
      relations: ["puzzles", "hints"],
    })
  }

  async updateProgress(userId: number, puzzleId: number, hintId: number | null, completed: boolean): Promise<UserProgress> {
    let progress = await this.userProgressRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'puzzles', 'hints']
    })

    if (!progress) {
      // Get the user and puzzle entities first
      const user = await this.userservice.findById(userId)
      const puzzle = await this.puzzleservice.getAPuzzle(puzzleId)
      
      if (!user || !puzzle) {
        throw new Error('User or puzzle not found')
      }

      progress = this.userProgressRepository.create()
      progress.user = user
      progress.puzzles = puzzle
    }

    if (hintId) {
      const hint = await this.hintservice.findById(hintId.toString())
      if (!hint) {
        throw new Error('Hint not found')
      }
      progress.hints = hint
      progress.hintsUsed += 1
    }

    progress.completed = completed
    progress.lastUpdated = new Date()

    return this.userProgressRepository.save(progress)
  }

  async getUserScore(userId: number, puzzleId: number): Promise<number> {
    const progress = await this.userProgressRepository.findOne({
      where: { 
        user: { id: userId },
        puzzles: { id: puzzleId },
        completed: true 
      },
      relations: ["puzzles"],
    })

    return progress?.puzzles?.pointValue || 0;
  }
}

