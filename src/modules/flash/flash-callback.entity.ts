import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pool } from '../pool/entities/pool.entity';

@Entity('flash_callbacks')
export class FlashCallback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pool, (pool) => pool.flashCallbacks)
  @JoinColumn({ name: 'pool_id' })
  pool: Pool;

  @Column({ type: 'varchar', length: 42 })
  caller: string;

  @Column('numeric', { precision: 38, scale: 18, name: 'amount0_delta' })
  amount0Delta: string;

  @Column('numeric', { precision: 38, scale: 18, name: 'amount1_delta' })
  amount1Delta: string;

  @Column('numeric', { precision: 38, scale: 18 })
  fee0: string;

  @Column('numeric', { precision: 38, scale: 18 })
  fee1: string;

  @Column({ type: 'varchar', length: 66, name: 'tx_hash' })
  txHash: string;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}
