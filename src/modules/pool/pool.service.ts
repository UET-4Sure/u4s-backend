import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { GetManyResponse, paginateData } from 'src/common/dtos';

import { PoolMetrics } from '../pool-metrics/entities/pool-metric.entity';
import { GetPositionEventsDto } from '../position/dto/get-position-events.dto';
import { LiquidityEvent } from '../position/entities/liquidity-event.entity';
import { Swap } from '../swap/entities/swap.entity';
import { Token } from '../token/entities/token.entity';
import { TokenPriceService } from '../token-price/token-price.service';

import { CreatePoolDto } from './dto/create-pool.dto';
import { ExecuteSwapDto } from './dto/execute-swap.dto';
import { GetPoolOhlcDto, TimeFrame } from './dto/get-pool-ohlc.dto';
import { GetPoolSwapsDto } from './dto/get-pool-swaps.dto';
import { GetPoolsDto } from './dto/get-pools.dto';
import { InitializePoolDto } from './dto/initialize-pool.dto';
import { Pool } from './entities/pool.entity';
import { OhlcData } from './interfaces/ohlc.interface';
import {
  GetManyPoolResponse,
  PoolResponse,
} from './interfaces/pool-response.interface';

@Injectable()
export class PoolService {
  constructor(
    @InjectRepository(Pool)
    private poolRepository: Repository<Pool>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    @InjectRepository(LiquidityEvent)
    private liquidityEventRepository: Repository<LiquidityEvent>,
    @InjectRepository(Swap)
    private swapRepository: Repository<Swap>,
    @InjectRepository(PoolMetrics)
    private poolMetricRepository: Repository<PoolMetrics>,
    private tokenPriceService: TokenPriceService,
  ) {}

  async create(createPoolDto: CreatePoolDto): Promise<Pool> {
    // Find token0
    const token0 = await this.tokenRepository.findOne({
      where: { address: createPoolDto.token0Address },
    });

    if (!token0) {
      throw new NotFoundException(
        `Token with address ${createPoolDto.token0Address} not found`,
      );
    }

    // Find token1
    const token1 = await this.tokenRepository.findOne({
      where: { address: createPoolDto.token1Address },
    });

    if (!token1) {
      throw new NotFoundException(
        `Token with address ${createPoolDto.token1Address} not found`,
      );
    }

    // Check if pool with this address already exists
    const existingPoolByAddress = await this.poolRepository.findOne({
      where: { address: createPoolDto.address },
    });

    if (existingPoolByAddress) {
      throw new ConflictException(
        `Pool with address ${createPoolDto.address} already exists`,
      );
    }

    // Check if pool with these tokens and fee tier already exists
    const existingPool = await this.poolRepository.findOne({
      where: {
        token0: { address: token0.address },
        token1: { address: token1.address },
        feeTier: createPoolDto.feeTier,
      },
    });

    if (existingPool) {
      throw new ConflictException(
        'Pool with these tokens and fee tier already exists',
      );
    }

    // Create new pool
    const pool = this.poolRepository.create({
      address: createPoolDto.address,
      token0,
      token1,
      feeTier: createPoolDto.feeTier,
      tickSpacing: createPoolDto.tickSpacing,
      hookAddress: createPoolDto.hookAddress,
      initialized: createPoolDto.initialized ?? false,
    });

    return this.poolRepository.save(pool);
  }

  private async calculateVolatility(pool: Pool): Promise<boolean> {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const metrics = await this.poolMetricRepository
      .createQueryBuilder('metric')
      .where('metric.pool = :poolId', { poolId: pool.id })
      .andWhere('metric.timestamp >= :oneHourAgo', { oneHourAgo })
      .orderBy('metric.timestamp', 'ASC')
      .getMany();

    if (metrics.length === 0) return false;

    const prices = metrics.map((metric) => Number(metric.priceRatio));
    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);

    // Calculate percentage change
    const percentageChange = ((highestPrice - lowestPrice) / lowestPrice) * 100;
    return percentageChange > 20;
  }

  async findAll(query: GetPoolsDto): Promise<GetManyPoolResponse> {
    const {
      page = 1,
      limit = 10,
      token0Address,
      token1Address,
      feeTier,
      initialized,
    } = query;
    const offset = (page - 1) * limit;

    const qb = this.poolRepository
      .createQueryBuilder('pool')
      .leftJoinAndSelect('pool.token0', 'token0')
      .leftJoinAndSelect('pool.token1', 'token1')
      .orderBy('pool.createdAt', 'DESC');

    if (token0Address) {
      qb.andWhere('token0.address = :token0Address', { token0Address });
    }

    if (token1Address) {
      qb.andWhere('token1.address = :token1Address', { token1Address });
    }

    if (feeTier !== undefined) {
      qb.andWhere('pool.feeTier = :feeTier', { feeTier });
    }

    if (initialized !== undefined) {
      qb.andWhere('pool.initialized = :initialized', { initialized });
    }

    const [pools, total] = await qb.getManyAndCount();
    const paginatedData = paginateData(pools, { limit, offset });

    // Calculate volatility for each pool
    const poolsWithVolatility = await Promise.all(
      paginatedData.data.map(async (pool) => ({
        ...pool,
        highVolatility: await this.calculateVolatility(pool),
      })),
    );

    return {
      data: poolsWithVolatility,
      total: paginatedData.total,
      count: paginatedData.count,
    };
  }

  async findOne(address: string): Promise<PoolResponse> {
    const pool = await this.poolRepository.findOne({
      where: { address },
      relations: ['token0', 'token1', 'positions', 'swaps'],
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${address} not found`);
    }

    const highVolatility = await this.calculateVolatility(pool);
    return {
      ...pool,
      highVolatility,
    };
  }

  async initialize(
    address: string,
    initializePoolDto: InitializePoolDto,
  ): Promise<Pool> {
    const pool = await this.poolRepository.findOne({
      where: { address },
      relations: ['token0', 'token1'],
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${address} not found`);
    }

    // Update pool initialization status
    pool.initialized = initializePoolDto.initialized;
    return this.poolRepository.save(pool);
  }

  async findPoolEvents(
    poolAddress: string,
    query: GetPositionEventsDto,
  ): Promise<GetManyResponse<LiquidityEvent>> {
    // Check if pool exists
    const pool = await this.poolRepository.findOne({
      where: { address: poolAddress.toLowerCase() },
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${poolAddress} not found`);
    }

    const { page = 1, limit = 10, type } = query;
    const offset = (page - 1) * limit;

    const qb = this.liquidityEventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.position', 'position')
      .leftJoinAndSelect('position.pool', 'pool')
      .where('pool.address = :poolAddress', {
        poolAddress: poolAddress.toLowerCase(),
      })
      .orderBy('event.createdAt', 'DESC');

    if (type) {
      qb.andWhere('event.type = :type', { type });
    }

    const [events, total] = await qb.getManyAndCount();
    const paginatedData = paginateData(events, { limit, offset });

    return {
      data: paginatedData.data,
      total: paginatedData.total,
      count: paginatedData.count,
    };
  }

  async findPoolSwaps(
    poolAddress: string,
    query: GetPoolSwapsDto,
  ): Promise<GetManyResponse<Swap>> {
    const pool = await this.poolRepository.findOne({
      where: { address: poolAddress.toLowerCase() },
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${poolAddress} not found`);
    }

    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const qb = this.swapRepository
      .createQueryBuilder('swap')
      .leftJoinAndSelect('swap.pool', 'pool')
      .where('pool.address = :poolAddress', {
        poolAddress: poolAddress.toLowerCase(),
      })
      .orderBy('swap.timestamp', 'DESC');

    const [swaps, total] = await qb.getManyAndCount();
    const paginatedData = paginateData(swaps, { limit, offset });

    return {
      data: paginatedData.data,
      total: paginatedData.total,
      count: paginatedData.count,
    };
  }

  async executeSwap(
    address: string,
    executeSwapDto: ExecuteSwapDto,
  ): Promise<Swap> {
    const pool = await this.poolRepository.findOne({
      where: { address },
      relations: ['token0', 'token1'],
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${address} not found`);
    }

    // Get token prices
    const tokenInPrice = await this.tokenPriceService.findLatest(
      executeSwapDto.tokenInAddress,
    );
    const tokenOutPrice = await this.tokenPriceService.findLatest(
      pool.token0.address === executeSwapDto.tokenInAddress
        ? pool.token1.address
        : pool.token0.address,
    );

    // Calculate metrics
    const amountInUsd =
      Number(executeSwapDto.amountIn) * Number(tokenInPrice.priceUsd);
    const feeUsd = amountInUsd * (Number(pool.feeTier) / 10000); // Convert basis points to decimal

    // Create swap record
    const swap = await this.swapRepository.save({
      pool,
      sender: executeSwapDto.sender,
      recipient: executeSwapDto.recipient,
      tokenInAddress: executeSwapDto.tokenInAddress,
      amountIn: executeSwapDto.amountIn,
      amountOut: executeSwapDto.amountOutMinimum, // This should be the actual amount out
      txHash: executeSwapDto.txHash,
      timestamp: new Date(),
    });

    // Create pool metric
    await this.poolMetricRepository.save({
      pool,
      volumeUsd: amountInUsd.toString(),
      feeUsd: feeUsd.toString(),
      tvlUsd: '0', // This should be calculated from pool's liquidity
      aprForLps: '0', // This should be calculated from fees and TVL
      priceRatio: executeSwapDto.priceRatio,
      liquidity: '0', // This should be calculated from pool's liquidity
      bucketStart: new Date(),
      timestamp: new Date(),
    });

    return swap;
  }

  async getPoolOhlc(
    address: string,
    query: GetPoolOhlcDto,
  ): Promise<OhlcData[]> {
    const pool = await this.poolRepository.findOne({
      where: { address },
      relations: ['token0', 'token1'],
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${address} not found`);
    }

    const {
      startTime,
      endTime,
      timeFrame = TimeFrame.HOUR,
      limit = 100,
    } = query;

    // Get pool metrics within the time range
    const metrics = await this.poolMetricRepository
      .createQueryBuilder('metric')
      .leftJoinAndSelect('metric.pool', 'pool')
      .where('pool.address = :address', { address })
      .andWhere('metric.timestamp BETWEEN :startTime AND :endTime', {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      })
      .orderBy('metric.timestamp', 'DESC')
      .limit(limit * 10) // Get more data than needed to ensure we have enough after grouping
      .getMany();

    // Get the last known price ratio before the start time
    const lastKnownMetric = await this.poolMetricRepository
      .createQueryBuilder('metric')
      .leftJoinAndSelect('metric.pool', 'pool')
      .where('pool.address = :address', { address })
      .andWhere('metric.timestamp < :startTime', {
        startTime: new Date(startTime),
      })
      .orderBy('metric.timestamp', 'DESC')
      .getOne();

    // Group metrics by time frame
    const groupedMetrics = this.groupMetricsByTimeFrame(metrics, timeFrame);

    // Calculate OHLC data for each time frame, using last known price for periods with no data
    const ohlcData = this.calculateOhlcData(
      groupedMetrics,
      lastKnownMetric?.priceRatio,
    );

    // Return only the most recent data points up to the limit
    return ohlcData.slice(0, limit);
  }

  private calculateOhlcData(
    groupedMetrics: Map<string, PoolMetrics[]>,
    lastKnownPrice?: string,
  ): OhlcData[] {
    const ohlcData: OhlcData[] = [];
    let lastPrice = lastKnownPrice ? Number(lastKnownPrice) : 0;
    let lastTimestamp: string | null = null;

    // Sort timestamps to process them in order
    const timestamps = Array.from(groupedMetrics.keys()).sort();

    timestamps.forEach((timestamp) => {
      const metrics = groupedMetrics.get(timestamp) || [];

      if (metrics.length === 0) {
        // Skip periods with no data if we don't have a last known price
        if (lastPrice === 0) return;

        // Only add a data point if there's a gap in the data
        if (lastTimestamp) {
          const timeDiff = this.getTimeDifference(lastTimestamp, timestamp);
          if (timeDiff > 1) {
            ohlcData.push({
              timestamp: new Date(timestamp),
              open: lastPrice.toString(),
              high: lastPrice.toString(),
              low: lastPrice.toString(),
              close: lastPrice.toString(),
              volume: '0',
            });
          }
        }
        return;
      }

      const prices = metrics.map((metric) => Number(metric.priceRatio));
      lastPrice = prices[prices.length - 1]; // Update last known price
      lastTimestamp = timestamp;

      ohlcData.push({
        timestamp: new Date(timestamp),
        open: prices[0].toString(),
        high: Math.max(...prices).toString(),
        low: Math.min(...prices).toString(),
        close: prices[prices.length - 1].toString(),
        volume: metrics
          .reduce((sum, metric) => sum + Number(metric.volumeUsd), 0)
          .toString(),
      });
    });

    return ohlcData;
  }

  private getTimeDifference(timestamp1: string, timestamp2: string): number {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60); // Difference in hours
  }

  private groupMetricsByTimeFrame(
    metrics: PoolMetrics[],
    timeFrame: TimeFrame,
  ): Map<string, PoolMetrics[]> {
    const grouped = new Map<string, PoolMetrics[]>();

    metrics.forEach((metric) => {
      const timestamp = new Date(metric.timestamp);
      let key: string;

      switch (timeFrame) {
        case TimeFrame.MINUTE:
          key = timestamp.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
          break;
        case TimeFrame.HOUR:
          key = timestamp.toISOString().slice(0, 13); // YYYY-MM-DDTHH
          break;
        case TimeFrame.DAY:
          key = timestamp.toISOString().slice(0, 10); // YYYY-MM-DD
          break;
        case TimeFrame.WEEK: {
          // Get the start of the week (Sunday)
          const weekStart = new Date(timestamp);
          weekStart.setDate(timestamp.getDate() - timestamp.getDay());
          key = weekStart.toISOString().slice(0, 10);
          break;
        }
      }

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(metric);
    });

    return grouped;
  }
}
