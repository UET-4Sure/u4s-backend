import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from '../pool/entities/pool.entity';
import { PoolMetrics } from './entities/pool-metric.entity';
import { PoolMetricsController } from './pool-metrics.controller';
import { PoolMetricsService } from './pool-metrics.service';

@Module({
  imports: [TypeOrmModule.forFeature([PoolMetrics, Pool])],
  controllers: [PoolMetricsController],
  providers: [PoolMetricsService],
  exports: [PoolMetricsService],
})
export class PoolMetricsModule {}
