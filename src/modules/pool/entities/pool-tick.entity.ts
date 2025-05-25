import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Pool } from './pool.entity';

@Entity('pool_ticks')
export class PoolTick {
  @PrimaryColumn('uuid', { name: 'pool_id' })
  poolId: string;

  @PrimaryColumn('int', { name: 'tick_index' })
  tickIndex: number;

  @ManyToOne(() => Pool, (pool) => pool.ticks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pool_id' })
  pool: Pool;

  @Column('numeric', {
    precision: 38,
    scale: 18,
    name: 'liquidity_gross',
    default: 0,
  })
  liquidityGross: string;

  @Column('numeric', {
    precision: 38,
    scale: 18,
    name: 'liquidity_net',
    default: 0,
  })
  liquidityNet: string;
}
