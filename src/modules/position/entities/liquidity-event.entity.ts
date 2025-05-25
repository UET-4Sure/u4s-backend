import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Position } from './position.entity';

@Entity('liquidity_events')
export class LiquidityEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Position, (pos) => pos.liquidityEvents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @Column({ type: 'enum', enum: ['mint', 'burn'], name: 'event_type' })
  eventType: 'mint' | 'burn';

  @Column('numeric', { precision: 38, scale: 18 })
  amount: string;

  @Column('numeric', { precision: 38, scale: 18, name: 'amount0' })
  amount0: string;

  @Column('numeric', { precision: 38, scale: 18, name: 'amount1' })
  amount1: string;

  @Column({ type: 'varchar', length: 66, name: 'tx_hash' })
  txHash: string;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}
