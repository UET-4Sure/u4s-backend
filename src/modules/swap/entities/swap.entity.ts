// src/modules/pool/entities/swap.entity.ts

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Pool } from 'src/modules/pool/entities/pool.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('swaps')
export class Swap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pool, (pool) => pool.swaps, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pool_id' })
  pool: Pool;

  @Column({ type: 'varchar', length: 42 })
  sender: string;

  @ManyToOne(() => User, (user) => user.swapsSent, { nullable: true })
  @JoinColumn({ name: 'sender', referencedColumnName: 'walletAddress' })
  userSender: User | null;

  @Column({ type: 'varchar', length: 42 })
  recipient: string;

  @ManyToOne(() => User, (user) => user.swapsReceived, { nullable: true })
  @JoinColumn({ name: 'recipient', referencedColumnName: 'walletAddress' })
  userRecipient: User | null;

  @Column({ type: 'varchar', length: 42, name: 'token_in_address' })
  tokenInAddress: string;

  @Column('numeric', { precision: 38, scale: 18, name: 'amount_in' })
  amountIn: string;

  @Column('numeric', { precision: 38, scale: 18, name: 'amount_out' })
  amountOut: string;

  @Column({ type: 'varchar', length: 66, name: 'tx_hash' })
  txHash: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
