import { Hints } from "src/hints/hints.entity"
import { Puzzles } from "src/puzzles/puzzles.entity"
import { User } from "src/users/users.entity"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm"


@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.userProgress)
  @JoinColumn({ name: 'userId' })
  user: Relation<User>;

<<<<<<< HEAD
  @ManyToOne(
    () => Puzzles,
    (puzzles) => puzzles.userProgress,
  )
  @JoinColumn({ name: "puzzleId" })
  puzzles: Puzzles
=======
  @ManyToOne(() => Puzzles, (puzzle) => puzzle.userProgress)
  @JoinColumn({ name: 'puzzleId' })
  puzzles: Puzzles;
>>>>>>> b40c5d58a38f2cff0d7a4d88c0625c5f83073de4

  @ManyToOne(() => Hints, (hints) => hints.userProgress)
  hints: Relation<Hints>;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: 0 })
  hintsUsed: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;

  @Column('simple-array', { nullable: true })
  completedLevels: number[];

  @Column({ type: 'int', default: 0 })
  progressPercentage: number;
}
