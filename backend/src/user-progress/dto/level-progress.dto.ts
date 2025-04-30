import { ApiProperty } from '@nestjs/swagger';

export class LevelProgressDto {
  @ApiProperty({ description: 'Percentage of puzzles completed in the level' })
  progress: number;

  @ApiProperty({ description: 'Number of puzzles solved in the level' })
  solved: number;

  @ApiProperty({ description: 'Total number of puzzles in the level' })
  total: number;
}
