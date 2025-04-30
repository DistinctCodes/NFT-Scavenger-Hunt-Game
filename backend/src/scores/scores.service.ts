import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scores } from './scores.entity';
import { User } from 'src/users/users.entity';
import { PuzzlesService } from 'src/puzzles/puzzles.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UsersService } from 'src/users/users.service';
import { LeaderboardGateway } from 'src/leaderboard/leaderboard.gateway';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Scores)
    private readonly scoresRepository: Repository<Scores>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly puzzleService: PuzzlesService,
    private readonly leaderboardGateway: LeaderboardGateway
  ) {}

  // Fetch leaderboard with pagination
  async getLeaderboard(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      relations: ['scores'],
      order: { score: 'DESC', updatedAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
  }

  // Create a new score entry
  async createScore(createScoreDto: CreateScoreDto) {
    const { username, puzzleId, score } = createScoreDto;
    
    // Find or create user
    const user = await this.userService.findOrCreateUser(username);
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }

    // Find puzzle
    const puzzle = await this.puzzleService.findOne(puzzleId);
    if (!puzzle) {
      throw new NotFoundException(`Puzzle ${puzzleId} not found`);
    }

    // Create and save score
    const scoreEntry = this.scoresRepository.create({
      user,
      puzzle,
      score
    });

    const savedScore = await this.scoresRepository.save(scoreEntry);

    // Notify connected clients about the new score
    this.leaderboardGateway.handleScoreUpdate({
      username: user.username,
      score: savedScore.score,
      puzzleId: puzzle.id
    });

    return savedScore;
  }

  // Get user's total score
  async getUserTotalScore(username: string): Promise<number> {
    const scores = await this.scoresRepository.find({
      where: { user: { username } },
      relations: ['user']
    });

    return scores.reduce((total, score) => total + score.score, 0);
  }

}
