import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../token/entities/token.entity';
import { Pool } from './entities/pool.entity';
import { PoolController } from './pool.controller';
import { PoolService } from './pool.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pool, Token])],
  controllers: [PoolController],
  providers: [PoolService],
  exports: [PoolService],
})
export class PoolModule {}
