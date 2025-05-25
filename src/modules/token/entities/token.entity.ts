import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pool } from '../../pool/entities/pool.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 42, unique: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  symbol: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'int' })
  decimals: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Pool, (pool) => pool.token0)
  poolsAsToken0: Pool[];

  @OneToMany(() => Pool, (pool) => pool.token1)
  poolsAsToken1: Pool[];
}
