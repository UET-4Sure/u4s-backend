import { Pool } from "src/modules/pool/entities/pool.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('pool_metrics')
export class PoolMetrics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pool, (p) => p.metrics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pool_id' })
  pool: Pool;

  @Column({ name: 'bucket_start', type: 'timestamp' })
  bucketStart: Date;

  @Column('numeric', {
    name: 'tvl_usd',
    precision: 38,
    scale: 18,
    default: '0',
  })
  tvlUsd: string;

  @Column('numeric', {
    name: 'volume_24h_usd',
    precision: 38,
    scale: 18,
    default: '0',
  })
  volume24hUsd: string;

  @Column('numeric', {
    name: 'fees_24h_usd',
    precision: 38,
    scale: 18,
    default: '0',
  })
  fees24hUsd: string;

  @Column('numeric', {
    name: 'apr_for_lps',
    precision: 10,
    scale: 4,
    default: '0',
  })
  aprForLps: string;

  @Column('numeric', {
    name: 'price_usd',
    precision: 38,
    scale: 18,
    default: '0',
  })
  priceUsd: string;

  @Column('numeric', {
    name: 'liquidity',
    precision: 38,
    scale: 18,
    default: '0',
  })
  liquidity: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
