import { Pool } from "src/modules/pool/entities/pool.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('pool_metrics')
export class PoolMetrics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pool, (p) => p.metrics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pool_id' })
  pool: Pool;

  @Column({ type: 'timestamp' })
  bucketStart: Date;             // e.g. “2025-05-31T21:00:00Z” for an hourly bucket

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  tvlUsd: string;                // total value locked at bucketStart (in USD)

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  volume24hUsd: string;          // 24 h rolling volume up to bucketStart (in USD)

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  fees24hUsd: string;            // 24 h rolling fees up to bucketStart (in USD)

  @Column({ type: 'numeric', precision: 10, scale: 4 })
  aprForLps: string;             // APR % (e.g. “1.6845”)

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;               // when this snapshot row was inserted
}
