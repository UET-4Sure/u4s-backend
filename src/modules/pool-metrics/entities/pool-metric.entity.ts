import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Pool } from '../../pool/entities/pool.entity';

@Entity('pool_metrics')
export class PoolMetrics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pool, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pool_id' })
  pool: Pool;

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  volumeUsd: string;

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  feeUsd: string;

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  tvlUsd: string;

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  aprForLps: string;

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  priceRatio: string;

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  liquidity: string;

  @Column({ type: 'timestamp' })
  bucketStart: Date;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
