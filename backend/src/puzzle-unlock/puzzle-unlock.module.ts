import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleUnlockService } from './puzzle-unlock.service';
import { PuzzleUnlockController } from './puzzle-unlock.controller';
import { UnlockRule } from './entities/unlock-rule.entity';
import { UserProgressModule } from '../user-progress/user-progress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnlockRule]),
    UserProgressModule,
  ],
  controllers: [PuzzleUnlockController],
  providers: [PuzzleUnlockService],
  exports: [PuzzleUnlockService],
})
export class PuzzleUnlockModule {}
