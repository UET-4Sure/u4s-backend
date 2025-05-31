import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pool } from '../pool/entities/pool.entity';
import { PoolMetricsOverviewDto } from './dto/pool-metrics-overview.dto';
import { PoolMetrics } from './entities/pool-metric.entity';

@Injectable()
export class PoolMetricsService {
  constructor(
    @InjectRepository(PoolMetrics)
    private poolMetricsRepository: Repository<PoolMetrics>,
    @InjectRepository(Pool)
    private poolRepository: Repository<Pool>,
  ) {}

  async getOverview(poolId: string): Promise<PoolMetricsOverviewDto> {
    // Check if pool exists
    const pool = await this.poolRepository.findOne({
      where: { id: poolId },
    });

    if (!pool) {
      throw new NotFoundException(`Pool with ID ${poolId} not found`);
    }

    // Get latest metrics
    const latestMetrics = await this.poolMetricsRepository.findOne({
      where: { pool: { id: poolId } },
      order: { bucketStart: 'DESC' },
    });

    if (!latestMetrics) {
      throw new NotFoundException(`No metrics found for pool ${poolId}`);
    }

    return {
      tvlUsd: latestMetrics.tvlUsd,
      volume24hUsd: latestMetrics.volume24hUsd,
      fees24hUsd: latestMetrics.fees24hUsd,
      aprForLps: latestMetrics.aprForLps,
      lastUpdated: latestMetrics.bucketStart,
    };
  }
}
