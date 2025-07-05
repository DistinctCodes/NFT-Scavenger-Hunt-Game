import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { PuzzleUnlockService } from './puzzle-unlock.service';
import { CreateUnlockRuleDto } from './dto/create-unlock-rule.dto';
import { UnlockRule } from './entities/unlock-rule.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('puzzle-unlock')
@Controller('puzzle-unlock')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PuzzleUnlockController {
  constructor(private readonly puzzleUnlockService: PuzzleUnlockService) {}

  @Post('rules')
  @ApiOperation({ summary: 'Create a new unlock rule' })
  @ApiResponse({ status: 201, description: 'The unlock rule has been successfully created.', type: UnlockRule })
  createRule(@Body() createUnlockRuleDto: CreateUnlockRuleDto): Promise<UnlockRule> {
    return this.puzzleUnlockService.createRule(createUnlockRuleDto);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get all unlock rules' })
  @ApiResponse({ status: 200, description: 'Return all unlock rules.', type: [UnlockRule] })
  findAllRules(): Promise<UnlockRule[]> {
    return this.puzzleUnlockService.findAllRules();
  }

  @Get('unlockable-puzzles/:userId')
  @ApiOperation({ summary: 'Get all puzzles that can be unlocked by a user' })
  @ApiResponse({ status: 200, description: 'Return list of unlockable puzzle IDs.' })
  async getUnlockablePuzzles(@Param('userId') userId: string) {
    return this.puzzleUnlockService.getUnlockablePuzzleIds(parseInt(userId, 10));
  }

  @Get('can-unlock/:userId/:puzzleId')
  @ApiOperation({ summary: 'Check if a user can unlock a specific puzzle' })
  @ApiResponse({ status: 200, description: 'Return true if the puzzle can be unlocked.' })
  canUnlockPuzzle(
    @Param('userId') userId: string,
    @Param('puzzleId') puzzleId: string,
  ): Promise<{ canUnlock: boolean }> {
    return this.puzzleUnlockService
      .canUnlockPuzzle(parseInt(userId, 10), puzzleId)
      .then(canUnlock => ({ canUnlock }));
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete an unlock rule' })
  @ApiResponse({ status: 200, description: 'The unlock rule has been deleted.' })
  removeRule(@Param('id') id: string): Promise<void> {
    return this.puzzleUnlockService.deleteRule(id);
  }
}
