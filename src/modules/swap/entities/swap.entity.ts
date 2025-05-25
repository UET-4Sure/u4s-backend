import { Pool } from 'src/modules/pool/entities/pool.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('swaps')
export class Swap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pool, (pool) => pool.swaps)
  @JoinColumn({ name: 'pool_id' })
  pool: Pool;

  @Column({ type: 'varchar', length: 42 })
  sender: string;

  @Column({ type: 'varchar', length: 42 })
  recipient: string;

  @Column('numeric', { precision: 38, scale: 18, name: 'amount_in' })
  amountIn: string;

  @Column('numeric', { precision: 38, scale: 18, name: 'amount_out' })
  amountOut: string;

  @Column('numeric', { precision: 38, scale: 18, name: 'sqrt_price_x96' })
  sqrtPriceX96: string;

  @Column('numeric', { precision: 38, scale: 18 })
  liquidity: string;

  @Column({ type: 'int' })
  tick: number;

  @Column({ type: 'varchar', length: 66, name: 'tx_hash' })
  txHash: string;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}
