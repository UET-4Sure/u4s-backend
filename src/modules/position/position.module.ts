import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pool } from '../pool/entities/pool.entity';

import { LiquidityEvent } from './entities/liquidity-event.entity';
import { Position } from './entities/position.entity';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';

@Module({
  imports: [TypeOrmModule.forFeature([Position, Pool, LiquidityEvent])],
  controllers: [PositionController],
  providers: [PositionService],
  exports: [PositionService],
})
export class PositionModule {}
