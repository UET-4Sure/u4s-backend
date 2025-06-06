import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { GetManyResponse } from 'src/common/dtos';

import { Pool } from '../pool/entities/pool.entity';

import {
  GetPoolVolumeMetricsDto,
  TimeInterval,
} from './dto/get-pool-volume-metrics.dto';
import { PoolFeesMetricDto } from './dto/pool-fees-metric.dto';
import { PoolLiquidityMetricDto } from './dto/pool-liquidity-metric.dto';
import { PoolMetricsOverviewDto } from './dto/pool-metrics-overview.dto';
import { PoolVolumeMetricDto } from './dto/pool-volume-metric.dto';
import { TotalTvlMetricDto } from './dto/total-tvl-metric.dto';
import { TotalVolumeMetricDto } from './dto/total-volume-metric.dto';
import { PoolMetrics } from './entities/pool-metric.entity';

@Injectable()
export class PoolMetricsService {
  constructor(
    @InjectRepository(PoolMetrics)
    private poolMetricsRepository: Repository<PoolMetrics>,
    @InjectRepository(Pool)
    private poolRepository: Repository<Pool>,
  ) {}

  async getOverview(poolAddress: string): Promise<PoolMetricsOverviewDto> {
    const pool = await this.poolRepository.findOne({
      where: { address: poolAddress.toLowerCase() },
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${poolAddress} not found`);
    }

    // Get latest metrics
    const latestMetrics = await this.poolMetricsRepository.findOne({
      where: { pool: { id: pool.id } },
      order: { timestamp: 'DESC' },
    });

    if (!latestMetrics) {
      throw new NotFoundException('Pool metrics not found');
    }

    // Calculate 24h metrics
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [volume24h, fees24h] = await Promise.all([
      this.poolMetricsRepository
        .createQueryBuilder('metrics')
        .select('SUM(metrics.volumeUsd)', 'total')
        .where('metrics.pool_id = :poolId', { poolId: pool.id })
        .andWhere('metrics.timestamp >= :start', {
          start: twentyFourHoursAgo,
        })
        .getRawOne(),
      this.poolMetricsRepository
        .createQueryBuilder('metrics')
        .select('SUM(metrics.feeUsd)', 'total')
        .where('metrics.pool_id = :poolId', { poolId: pool.id })
        .andWhere('metrics.timestamp >= :start', {
          start: twentyFourHoursAgo,
        })
        .getRawOne(),
    ]);

    return {
      tvlUsd: latestMetrics.tvlUsd,
      volume24hUsd: volume24h?.total || '0',
      fees24hUsd: fees24h?.total || '0',
      aprForLps: latestMetrics.aprForLps,
      priceRatio: latestMetrics.priceRatio,
      liquidity: latestMetrics.liquidity,
      lastUpdated: latestMetrics.timestamp,
    };
  }

  async getVolumeMetrics(
    poolAddress: string,
    query: GetPoolVolumeMetricsDto,
  ): Promise<GetManyResponse<PoolVolumeMetricDto>> {
    // 1) Check if pool exists
    const pool = await this.poolRepository.findOne({
      where: { address: poolAddress.toLowerCase() },
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${poolAddress} not found`);
    }

    // 2) Default to DAY / 24 if not provided
    const interval = query.interval ?? TimeInterval.DAY;
    const limit = query.limit ?? 24;

    // Get date format based on interval
    let dateFormat: string;
    switch (interval) {
      case TimeInterval.SECOND:
        dateFormat = '%Y-%m-%d %H:%i:%s';
        break;
      case TimeInterval.HOUR:
        dateFormat = '%Y-%m-%d %H:00:00';
        break;
      case TimeInterval.DAY:
        dateFormat = '%Y-%m-%d 00:00:00';
        break;
      case TimeInterval.WEEK:
        dateFormat = '%Y-%u 00:00:00'; // %u gives week number
        break;
      case TimeInterval.MONTH:
        dateFormat = '%Y-%m-01 00:00:00';
        break;
      case TimeInterval.YEAR:
        dateFormat = '%Y-01-01 00:00:00';
        break;
      default:
        dateFormat = '%Y-%m-%d 00:00:00';
    }

    // 3) Build the raw‐SQL aggregation
    const qb = this.poolMetricsRepository
      .createQueryBuilder('metrics')
      .select([
        `DATE_FORMAT(metrics.bucketStart, '${dateFormat}') AS bucketStart`,
        `CAST(SUM(metrics.volumeUsd) AS CHAR) AS volumeUsd`,
      ])
      .where('metrics.pool_id = :poolId', { poolId: pool.id })
      .groupBy(`DATE_FORMAT(metrics.bucketStart, '${dateFormat}')`)
      .orderBy('bucketStart', 'ASC')
      .limit(limit);


    // Get raw results and count separately
    const [rawRows, total] = await Promise.all([
      qb.getRawMany(),
      qb.getCount(),
    ]);

    // Map raw rows into DTO shape
    const data: PoolVolumeMetricDto[] = rawRows.map((row) => ({
      bucketStart: new Date(row.bucketStart),
      volumeUsd: row.volumeUsd,
    }));

    return {
      data,
      total,
      count: data.length,
    };
  }

  async getFeesMetrics(
    poolAddress: string,
    query: GetPoolVolumeMetricsDto,
  ): Promise<GetManyResponse<PoolFeesMetricDto>> {
    // 1) Check if pool exists
    const pool = await this.poolRepository.findOne({
      where: { address: poolAddress.toLowerCase() },
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${poolAddress} not found`);
    }

    // 2) Default to DAY / 24 if not provided
    const interval = query.interval ?? TimeInterval.DAY;
    const limit = query.limit ?? 24;

    // Get date format based on interval
    let dateFormat: string;
    switch (interval) {
      case TimeInterval.SECOND:
        dateFormat = '%Y-%m-%d %H:%i:%s';
        break;
      case TimeInterval.HOUR:
        dateFormat = '%Y-%m-%d %H:00:00';
        break;
      case TimeInterval.DAY:
        dateFormat = '%Y-%m-%d 00:00:00';
        break;
      case TimeInterval.WEEK:
        dateFormat = '%Y-%u 00:00:00'; // %u gives week number
        break;
      case TimeInterval.MONTH:
        dateFormat = '%Y-%m-01 00:00:00';
        break;
      case TimeInterval.YEAR:
        dateFormat = '%Y-01-01 00:00:00';
        break;
      default:
        dateFormat = '%Y-%m-%d 00:00:00';
    }

    // 3) Build the raw‐SQL aggregation
    const qb = this.poolMetricsRepository
      .createQueryBuilder('metrics')
      .select([
        `DATE_FORMAT(metrics.bucketStart, '${dateFormat}') AS bucketStart`,
        `CAST(SUM(metrics.feeUsd) AS CHAR) AS feesUsd`,
      ])
      .where('metrics.pool_id = :poolId', { poolId: pool.id })
      .groupBy(`DATE_FORMAT(metrics.bucketStart, '${dateFormat}')`)
      .orderBy('bucketStart', 'ASC')
      .limit(limit);


    // Get raw results and count separately
    const [rawRows, total] = await Promise.all([
      qb.getRawMany(),
      qb.getCount(),
    ]);


    // Map raw rows into DTO shape
    const data: PoolFeesMetricDto[] = rawRows.map((row) => ({
      bucketStart: new Date(row.bucketStart),
      feesUsd: row.feesUsd,
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

    // First try to get TVL at the requested timestamp
    const qb = this.poolMetricsRepository
      .createQueryBuilder('metrics')
      .select([
        `CAST(SUM(metrics.tvlUsd) AS CHAR) AS totalTvlUsd`,
        `MAX(metrics.bucketStart) AS timestamp`,
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

    // If no data found at requested timestamp, get the earliest TVL data
    if (!result || !result.totalTvlUsd) {
      const earliestQb = this.poolMetricsRepository
        .createQueryBuilder('metrics')
        .select([
          `CAST(SUM(metrics.tvlUsd) AS CHAR) AS totalTvlUsd`,
          `MIN(metrics.bucketStart) AS timestamp`,
        ])
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('MIN(m2.bucketStart)')
            .from(PoolMetrics, 'm2')
            .where('m2.pool_id = metrics.pool_id')
            .getQuery();
          return 'metrics.bucketStart = ' + subQuery;
        });

      const earliestResult = await earliestQb.getRawOne();

      if (!earliestResult || !earliestResult.totalTvlUsd) {
        return {
          totalTvlUsd: '0',
          timestamp: targetTime.toISOString(),
        };
      }

      return {
        totalTvlUsd: earliestResult.totalTvlUsd,
        timestamp: new Date(earliestResult.timestamp).toISOString(),
      };
    }

    return {
      totalTvlUsd: result.totalTvlUsd,
      timestamp: new Date(result.timestamp).toISOString(),
    };
  }

  async getTotalVolume24h(asOf?: string): Promise<TotalVolumeMetricDto> {
    // Parse asOf timestamp or use current time
    const targetTime = asOf ? new Date(asOf) : new Date();

    // First try to get volume at the requested timestamp
    const qb = this.poolMetricsRepository
      .createQueryBuilder('metrics')
      .select([
        `CAST(SUM(metrics.volumeUsd) AS CHAR) AS totalVolumeUsd`,
        `MAX(metrics.bucketStart) AS asOf`,
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

    // If no data found at requested timestamp, get the earliest volume data
    if (!result || !result.totalVolumeUsd) {
      const earliestQb = this.poolMetricsRepository
        .createQueryBuilder('metrics')
        .select([
          `CAST(SUM(metrics.volumeUsd) AS CHAR) AS totalVolumeUsd`,
          `MIN(metrics.bucketStart) AS asOf`,
        ])
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('MIN(m2.bucketStart)')
            .from(PoolMetrics, 'm2')
            .where('m2.pool_id = metrics.pool_id')
            .getQuery();
          return 'metrics.bucketStart = ' + subQuery;
        });

      const earliestResult = await earliestQb.getRawOne();

      if (!earliestResult || !earliestResult.totalVolumeUsd) {
        return {
          totalVolumeUsd: '0',
          asOf: targetTime.toISOString(),
        };
      }

      return {
        totalVolumeUsd: earliestResult.totalVolumeUsd,
        asOf: new Date(earliestResult.asOf).toISOString(),
      };
    }

    return {
      totalVolumeUsd: result.totalVolumeUsd,
      asOf: new Date(result.asOf).toISOString(),
    };
  }

  async getLiquidityMetrics(
    poolAddress: string,
    query: GetPoolVolumeMetricsDto,
  ): Promise<GetManyResponse<PoolLiquidityMetricDto>> {
    // 1) Check if pool exists
    const pool = await this.poolRepository.findOne({
      where: { address: poolAddress.toLowerCase() },
    });
    if (!pool) {
      throw new NotFoundException(`Pool with address ${poolAddress} not found`);
    }

    // 2) Default to DAY / 24 if not provided
    const interval = query.interval ?? TimeInterval.DAY;
    const limit = query.limit ?? 24;

    // 3) Build the raw‐SQL aggregation
    const qb = this.poolMetricsRepository
      .createQueryBuilder('metrics')
      .select([
        `DATE_FORMAT(metrics.bucketStart, '%Y-%m-%d %H:00:00') AS bucketStart`,
        `CAST(MAX(metrics.liquidity) AS CHAR) AS liquidity`,
      ])
      .where('metrics.pool_id = :poolId', { poolId: pool.id })
      .andWhere('metrics.bucketStart <= NOW()')
      .andWhere('metrics.bucketStart > DATE_SUB(NOW(), INTERVAL 1 DAY)')
      .groupBy('DATE_FORMAT(metrics.bucketStart, "%Y-%m-%d %H:00:00")')
      .orderBy('bucketStart', 'ASC')
      .limit(limit);

    // Get raw results and count separately
    const [rawRows, total] = await Promise.all([
      qb.getRawMany(),
      qb.getCount(),
    ]);

    // Map raw rows into DTO shape
    const data: PoolLiquidityMetricDto[] = rawRows.map((row) => ({
      bucketStart: new Date(row.bucketStart),
      liquidity: row.liquidity,
    }));

    return {
      data,
      total,
      count: data.length,
    };
  }
}
