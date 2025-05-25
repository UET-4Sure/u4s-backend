import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Token } from '../../token/entities/token.entity';
import { FlashCallback } from 'src/modules/flash/flash-callback.entity';
import { Swap } from 'src/modules/swap/entities/swap.entity';
import { Position } from 'src/modules/position/entities/position.entity';
import { PoolTick } from './pool-tick.entity';

@Entity('pools')
export class Pool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Token, (token) => token.poolsAsToken0)
  @JoinColumn({ name: 'token0_id' })
  token0: Token;

  @ManyToOne(() => Token, (token) => token.poolsAsToken1)
  @JoinColumn({ name: 'token1_id' })
  token1: Token;

  @Column({ type: 'int', name: 'fee_tier' })
  feeTier: number;

  @Column({ type: 'int', name: 'tick_spacing' })
  tickSpacing: number;

  @Column({ type: 'varchar', length: 42, name: 'hook_address', nullable: true })
  hookAddress: string;

  @Column({ type: 'boolean', default: false })
  initialized: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => PoolTick, (tick) => tick.pool)
  ticks: PoolTick[];

  @OneToMany(() => Position, (pos) => pos.pool)
  positions: Position[];

  @OneToMany(() => Swap, (swap) => swap.pool)
  swaps: Swap[];

  @OneToMany(() => FlashCallback, (hook) => hook.pool)
  flashCallbacks: FlashCallback[];
}
