import { Pool } from 'src/modules/pool/entities/pool.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LiquidityEvent } from './liquidity-event.entity';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pool, (pool) => pool.positions)
  @JoinColumn({ name: 'pool_id' })
  pool: Pool;

  @Column({ type: 'varchar', length: 42, name: 'owner_address' })
  ownerAddress: string;

  @Column({ type: 'int', name: 'tick_lower' })
  tickLower: number;

  @Column({ type: 'int', name: 'tick_upper' })
  tickUpper: number;

  @Column('numeric', { precision: 38, scale: 18, name: 'liquidity_amount' })
  liquidityAmount: string;

  @Column('numeric', {
    precision: 38,
    scale: 18,
    name: 'fee_growth0',
    default: 0,
  })
  feeGrowth0: string;

  @Column('numeric', {
    precision: 38,
    scale: 18,
    name: 'fee_growth1',
    default: 0,
  })
  feeGrowth1: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => LiquidityEvent, (evt) => evt.position)
  liquidityEvents: LiquidityEvent[];
}
