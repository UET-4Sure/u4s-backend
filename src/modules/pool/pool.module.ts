import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LiquidityEvent } from '../position/entities/liquidity-event.entity';
import { Swap } from '../swap/entities/swap.entity';
import { Token } from '../token/entities/token.entity';

import { Pool } from './entities/pool.entity';
import { PoolController } from './pool.controller';
import { PoolService } from './pool.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pool, Token, LiquidityEvent, Swap])],
  controllers: [PoolController],
  providers: [PoolService],
  exports: [PoolService],
})
export class PoolModule {}
