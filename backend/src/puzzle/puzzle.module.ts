import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Puzzle } from './puzzle.entity';
import { PuzzleSubmissionController } from 'src/puzzle-submission/puzzle-submission.controller';
import { PuzzleSubmissionService } from 'src/puzzle-submission/puzzle-submission.service';

@Module({
  imports: [TypeOrmModule.forFeature([Puzzle]), AuthModule],
  controllers: [PuzzleSubmissionController],
  providers: [PuzzleSubmissionService],
  exports: [PuzzleSubmissionService],
})
export class PuzzlesModule {}
