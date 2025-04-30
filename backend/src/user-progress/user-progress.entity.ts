import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Puzzles } from '../puzzles/puzzles.entity';
import { Hints } from '../hints/hints.entity';
import { Level } from '../level/entities/level.entity';

@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Puzzles, { eager: true })
  puzzles: Puzzles;

  @ManyToOne(() => Hints, { eager: true })
  hints: Hints;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: 0 })
  hintsUsed: number;

  @ManyToMany(() => Level, { eager: true })
  @JoinTable()
  completedLevels: Level[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdated: Date;

  @Column({ type: 'int', default: 0 })
  progressPercentage: number;
}
