import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Scores } from './scores.entity';
import { PuzzlesService } from 'src/puzzles/puzzles.service';

@Injectable()
export class ScoresService {
  constructor(

    //deine repository injection for scores entity
    @InjectRepository(Scores)
    private  scoresRepository: Repository<Scores>,

       //deine repository injection for user entity
    @InjectRepository(User)
    private  userRepository: Repository<User>,

    //define dependency injection for puzzle Service
    private readonly puzzleService: PuzzlesService,
  ) {}
  //fetch leaderboard with pagination
  async getLeaderboard(page: number = 1, limit: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      order: { scores: 'DESC', updatedAt: 'ASC' },
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

  // Update or insert user score
  async updateScore(username: string, score: number) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    // Create a new score entry
    const scoreEntry = new Scores();
    scoreEntry.score = score;
    scoreEntry.user = user;

    // Save the new score
    await this.scoresRepository.save(scoreEntry);

    return user;
  }
}
