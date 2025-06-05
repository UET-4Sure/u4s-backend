import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { GetManyResponse, paginateData } from 'src/common/dtos';

import { GetPositionEventsDto } from '../position/dto/get-position-events.dto';
import { LiquidityEvent } from '../position/entities/liquidity-event.entity';
import { Swap } from '../swap/entities/swap.entity';
import { Token } from '../token/entities/token.entity';

import { CreatePoolDto } from './dto/create-pool.dto';
import { ExecuteSwapDto } from './dto/execute-swap.dto';
import { GetPoolSwapsDto } from './dto/get-pool-swaps.dto';
import { GetPoolsDto } from './dto/get-pools.dto';
import { InitializePoolDto } from './dto/initialize-pool.dto';
import { Pool } from './entities/pool.entity';

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

  async findAll(query: GetPoolsDto): Promise<GetManyResponse<Pool>> {
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

    return {
      data: paginatedData.data,
      total: paginatedData.total,
      count: paginatedData.count,
    };
  }

  async findOne(address: string): Promise<Pool> {
    const pool = await this.poolRepository.findOne({
      where: { address },
      relations: ['token0', 'token1', 'positions', 'swaps'],
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${address} not found`);
    }

    return pool;
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
    poolAddress: string,
    executeSwapDto: ExecuteSwapDto,
  ): Promise<Swap> {
    // Find the pool
    const pool = await this.poolRepository.findOne({
      where: { address: poolAddress.toLowerCase() },
      relations: ['token0', 'token1'],
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${poolAddress} not found`);
    }

    // TODO: Implement the actual swap logic here
    // This would typically involve:
    // 1. Validating the swap parameters
    // 2. Calculating the expected output amount
    // 3. Executing the swap on-chain
    // 4. Recording the swap details

    // Create swap record with the provided sender
    const swap = this.swapRepository.create({
      pool,
      sender: executeSwapDto.sender,
      recipient: executeSwapDto.recipient,
      tokenInAddress: executeSwapDto.tokenInAddress,
      amountIn: executeSwapDto.amountIn,
      amountOut: '0', // This would be calculated based on the pool state
      sqrtPriceX96: '0', // This would be updated based on the pool state
      liquidity: '0', // This would be updated based on the pool state
      tick: 0, // This would be updated based on the pool state
      txHash: '0x', // This would be the actual transaction hash
    });

    return this.swapRepository.save(swap);
  }
}
