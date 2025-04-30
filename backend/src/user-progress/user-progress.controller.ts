import { UserProgressService } from './user-progress.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  Query,
  BadRequestException,
  UseGuards,
  ParseUUIDPipe
} from '@nestjs/common';
import { UserProgressDto } from './dto/user-progress.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/auth/enums/roles.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UserProgress } from './user-progress.entity';
import { LevelProgressDto } from './dto';

@ApiTags('user-progress')
@Controller('user-progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Get()
  async getUserProgress(@Request() req) {
    return this.userProgressService.getUserProgress(req.user.id);
  }

  @Post('update')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  async updateProgress(
    @Request() req,
    @Body()
    updateProgressDto: {
      puzzleId: number;
      hintId: number | null;
      completed: boolean;
    },
  ) {
    return this.userProgressService.updateProgress(
      req.user.id,
      updateProgressDto.puzzleId,
      updateProgressDto.hintId,
      updateProgressDto.completed,
    );
  }

  // GET endpoint for user score
  @Get('user-score')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get total user score across all completed puzzles' })
  @ApiQuery({ name: 'userId', type: Number, required: true })
  @ApiResponse({ status: 200, description: 'Returns the total user score' })
  async getUserScore(
    @Query('userId', ParseIntPipe) userId: number
  ): Promise<number> {
    return this.userProgressService.getUserScore(userId);
  }

  @Post('puzzle-completed')
  @ApiOperation({ summary: 'Mark a puzzle as completed' })
  @ApiResponse({ status: 200, description: 'Puzzle marked as completed', type: UserProgress })
  async puzzleCompleted(
    @Request() req,
    @Body() body: { puzzleId: number }
  ): Promise<UserProgress> {
    return this.userProgressService.puzzleCompleted(req.user.id, body.puzzleId);
  }

  @Post('level-completed')
  @ApiOperation({ summary: 'Mark a level as completed' })
  @ApiResponse({ status: 200, description: 'Level marked as completed', type: UserProgress })
  async levelCompleted(
    @Request() req,
    @Body() body: { levelId: string }
  ): Promise<UserProgress> {
    return this.userProgressService.levelCompleted(req.user.id, body.levelId);
  }

  @Get(':userId/level/:levelId')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get level progress for a user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'levelId', type: String })
  @ApiResponse({ status: 200, description: 'Returns the level progress', type: LevelProgressDto })
  async getLevelProgress(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('levelId', ParseUUIDPipe) levelId: string
  ): Promise<LevelProgressDto> {
    return this.userProgressService.getLevelProgress(userId, levelId);
  }

  @Get(':userId/level/:levelId/solved')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get number of solved puzzles in a level' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'levelId', type: String })
  @ApiResponse({ status: 200, description: 'Returns the number of solved puzzles', type: Number })
  async getSolvedPuzzlesInLevel(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('levelId', ParseUUIDPipe) levelId: string
  ): Promise<number> {
    const { solved } = await this.userProgressService.getLevelProgress(userId, levelId);
    return solved;
  }
}
