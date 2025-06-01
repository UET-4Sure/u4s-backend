
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_bans')
export class UserBan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255, name: 'banned_by', nullable: true })
  bannedBy: string | null;

  @Column({ type: 'text', name: 'reason', nullable: true })
  reason: string | null;

  @Column({
    type: 'timestamp',
    name: 'start_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startAt: Date;

  @Column({ type: 'timestamp', name: 'end_at' })
  endAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
