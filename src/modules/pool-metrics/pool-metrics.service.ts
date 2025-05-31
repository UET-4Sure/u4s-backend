import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetManyResponse } from '../../common/dtos';
import { Pool } from '../pool/entities/pool.entity';
import {
  GetPoolVolumeMetricsDto,
  TimeInterval,
} from './dto/get-pool-volume-metrics.dto';
import { PoolFeesMetricDto } from './dto/pool-fees-metric.dto';
import { PoolMetricsOverviewDto } from './dto/pool-metrics-overview.dto';
import { PoolVolumeMetricDto } from './dto/pool-volume-metric.dto';
import { TotalTvlMetricDto } from './dto/total-tvl-metric.dto';
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

  async getVolumeMetrics(
    poolId: string,
    query: GetPoolVolumeMetricsDto,
  ): Promise<GetManyResponse<PoolVolumeMetricDto>> {
    // 1) Check if pool exists
    const pool = await this.poolRepository.findOne({
      where: { id: poolId },
    });
    if (!pool) {
      throw new NotFoundException(`Pool with ID ${poolId} not found`);
    }

    // 2) Default to DAY / 24 if not provided
    const interval = query.interval ?? TimeInterval.DAY;
    const limit = query.limit ?? 24;

    // 3) Build the raw‐SQL aggregation using date_trunc on the actual column name 'bucket_start'
    const qb = this.poolMetricsRepository
      .createQueryBuilder('metrics')
      .select([
        `date_trunc('${interval}', metrics.bucket_start)     AS "bucketStart"`,
        `SUM(metrics.volume24hUsd)    ::TEXT                  AS "volume24hUsd"`,
        `SUM(metrics.fees24hUsd)      ::TEXT                  AS "fees24hUsd"`,
        `MAX(metrics.tvlUsd)          ::TEXT                  AS "tvlUsd"`,
      ])
      .where('metrics.pool_id = :poolId', { poolId })
      .andWhere(`metrics.bucket_start <= date_trunc('${interval}', now())`)
      .andWhere(
        `metrics.bucket_start >  date_trunc('${interval}', now()) - INTERVAL '${this.getIntervalValue(interval)}'`,
      )
      .groupBy(`date_trunc('${interval}', metrics.bucket_start)`)
      .orderBy(`date_trunc('${interval}', metrics.bucket_start)`, 'ASC')
      .limit(limit);

    // Get raw results and count separately
    const [rawRows, total] = await Promise.all([
      qb.getRawMany(),
      qb.getCount(),
    ]);

    // 8) Map raw rows into your DTO shape
    const data: PoolVolumeMetricDto[] = rawRows.map((row) => ({
      bucketStart: new Date(row.bucketStart),
      volume24hUsd: row.volume24hUsd,
      fees24hUsd: row.fees24hUsd,
      tvlUsd: row.tvlUsd,
    }));

    return {
      data,
      total,
      count: data.length,
    };
  }

  async getFeesMetrics(
    poolId: string,
    query: GetPoolVolumeMetricsDto,
  ): Promise<GetManyResponse<PoolFeesMetricDto>> {
    // 1) Check if pool exists
    const pool = await this.poolRepository.findOne({
      where: { id: poolId },
    });
    if (!pool) {
      throw new NotFoundException(`Pool with ID ${poolId} not found`);
    }

    // 2) Default to DAY / 24 if not provided
    const interval = query.interval ?? TimeInterval.DAY;
    const limit = query.limit ?? 24;

    // 3) Build the raw‐SQL aggregation
    const qb = this.poolMetricsRepository
      .createQueryBuilder('metrics')
      .select([
        `date_trunc('${interval}', metrics.bucket_start)     AS "bucketStart"`,
        `SUM(metrics.fees24hUsd)      ::TEXT                  AS "fees24hUsd"`,
      ])
      .where('metrics.pool_id = :poolId', { poolId })
      .andWhere(`metrics.bucket_start <= date_trunc('${interval}', now())`)
      .andWhere(
        `metrics.bucket_start >  date_trunc('${interval}', now()) - INTERVAL '${this.getIntervalValue(interval)}'`,
      )
      .groupBy(`date_trunc('${interval}', metrics.bucket_start)`)
      .orderBy(`date_trunc('${interval}', metrics.bucket_start)`, 'ASC')
      .limit(limit);

    // Get raw results and count separately
    const [rawRows, total] = await Promise.all([
      qb.getRawMany(),
      qb.getCount(),
    ]);

    // Map raw rows into DTO shape
    const data: PoolFeesMetricDto[] = rawRows.map((row) => ({
      bucketStart: new Date(row.bucketStart),
      fees24hUsd: row.fees24hUsd,
    }));

    return {
      data,
      total,
      count: data.length,
    };
  }

  private getIntervalValue(interval: TimeInterval): string {
    switch (interval) {
      case TimeInterval.HOUR:
        return '1 hour';
      case TimeInterval.DAY:
        return '1 day';
      case TimeInterval.WEEK:
        return '1 week';
      case TimeInterval.MONTH:
        return '1 month';
      case TimeInterval.YEAR:
        return '1 year';
      default:
        return '1 day';
    }
  }

  async getTotalTvl(timestamp?: string): Promise<TotalTvlMetricDto> {
    // Parse timestamp or use current time
    const targetTime = timestamp ? new Date(timestamp) : new Date();

    // Build query to get the latest TVL for each pool before the target time
    const qb = this.poolMetricsRepository
      .createQueryBuilder('metrics')
      .select([
        `SUM(metrics.tvlUsd) ::TEXT AS "totalTvlUsd"`,
        `MAX(metrics.bucketStart) AS "timestamp"`,
      ])
      .where('metrics.bucketStart <= :targetTime', { targetTime })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('MAX(m2.bucketStart)')
          .from(PoolMetrics, 'm2')
          .where('m2.pool_id = metrics.pool_id')
          .andWhere('m2.bucketStart <= :targetTime', { targetTime })
          .getQuery();
        return 'metrics.bucketStart = ' + subQuery;
      });

    const result = await qb.getRawOne();

    if (!result) {
      return {
        totalTvlUsd: '0',
        timestamp: targetTime,
      };
    }

    return {
      totalTvlUsd: result.totalTvlUsd,
      timestamp: new Date(result.timestamp),
    };
  }
}
