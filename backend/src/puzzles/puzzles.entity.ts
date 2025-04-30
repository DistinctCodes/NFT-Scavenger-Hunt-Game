import { Answers } from 'src/answers/answers.entity';
import { Hints } from 'src/hints/hints.entity';
import { Level } from 'src/level/entities/level.entity';
import { NFTs } from 'src/nfts/nfts.entity';
import { UserProgress } from 'src/user-progress/User-Progress.entity';
import { Scores } from 'src/scores/scores.entity';
import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  BeforeInsert,
  DeleteDateColumn
} from 'typeorm';
import { LevelEnum } from 'src/enums/LevelEnum';

@Entity()
export class Puzzles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  title: string;

  @OneToMany(() => Hints, (hints) => hints.puzzles)
  hints: Hints[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date; // Soft delete column

  @Column({ type: 'int' })
  pointValue: number;

  @OneToOne(() => NFTs, (nfts) => nfts.puzzles, { nullable: true })
  nfts: NFTs;

  @ManyToOne(() => UserProgress, (userProgress) => userProgress.puzzles)
  userProgress: UserProgress;

  @ManyToOne(() => Level, (level) => level.puzzles)
  level: Level;

  @Column({ type: 'enum', enum: LevelEnum })
  levelEnum: LevelEnum;

  @OneToMany(() => Scores, (score) => score.puzzle, { onDelete: 'SET NULL' }) 
  scores: Scores[];

  @OneToMany(() => Answers, (answer) => answer.puzzles)
  answers: Answers[];

  @OneToMany(() => UserProgress, (userProgress) => userProgress.puzzles)
  userProgress: UserProgress[];

  @BeforeInsert()
  async updateLevelCount() {
<<<<<<< HEAD
    if (this.level) {
      await this.level.incrementCount(this.levelEnum);
    }
=======
      if (this.level) {
          await Level.incrementCount(this.levelEnum);
      }
>>>>>>> b40c5d58a38f2cff0d7a4d88c0625c5f83073de4
  }
}
