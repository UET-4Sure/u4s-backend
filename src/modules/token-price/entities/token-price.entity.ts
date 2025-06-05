import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Token } from 'src/modules/token/entities/token.entity';

@Entity('token_price')
export class TokenPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Token, (t) => t.prices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'token_id' })
  token: Token;

  @Column({ type: 'numeric', precision: 38, scale: 18 })
  priceUsd: string; // price in USD

  @Column({ type: 'timestamp' })
  timestamp: Date; // e.g. when this price was fetched
}
