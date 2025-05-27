import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../token/entities/token.entity';
import { PoolTick } from './entities/pool-tick.entity';
import { Pool } from './entities/pool.entity';
import { PoolController } from './pool.controller';
import { PoolService } from './pool.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pool, Token, PoolTick])],
  controllers: [PoolController],
  providers: [PoolService],
  exports: [PoolService],
})
export class PoolModule {}
