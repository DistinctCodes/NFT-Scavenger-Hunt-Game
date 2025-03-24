import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('api_tracking')
export class ApiTracking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index() // Optimize queries by HTTP method
  method: string;

  @Column()
  url: string;

  @Column()
  @Index() // Optimize queries by status code
  statusCode: number;

  @Column()
  responseTime: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Index() // Optimize queries by timestamp range
  timestamp: Date;
}
