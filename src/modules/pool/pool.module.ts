import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PoolMetrics } from '../pool-metrics/entities/pool-metric.entity';
import { LiquidityEvent } from '../position/entities/liquidity-event.entity';
import { Swap } from '../swap/entities/swap.entity';
import { Token } from '../token/entities/token.entity';
import { TokenPriceModule } from '../token-price/token-price.module';

import { Pool } from './entities/pool.entity';
import { PoolController } from './pool.controller';
import { PoolService } from './pool.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pool, Token, LiquidityEvent, Swap, PoolMetrics]),
    TokenPriceModule,
  ],
  controllers: [PoolController],
  providers: [PoolService],
  exports: [PoolService],
})
export class PoolModule {}
