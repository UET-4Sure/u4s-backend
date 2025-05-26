import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetManyResponse, paginateData } from '../../common/dtos';
import { Token } from '../token/entities/token.entity';
import { CreatePoolDto } from './dto/create-pool.dto';
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

  async findOne(id: string): Promise<Pool> {
    const pool = await this.poolRepository.findOne({
      where: { id },
      relations: [
        'token0',
        'token1',
        'ticks',
        'positions',
        'swaps',
        'flashCallbacks',
      ],
    });

    if (!pool) {
      throw new NotFoundException(`Pool with ID ${id} not found`);
    }

    return pool;
  }

  async initialize(
    id: string,
    initializePoolDto: InitializePoolDto,
  ): Promise<Pool> {
    const pool = await this.poolRepository.findOne({
      where: { id },
      relations: ['token0', 'token1'],
    });

    if (!pool) {
      throw new NotFoundException(`Pool with ID ${id} not found`);
    }

    // Update pool initialization status
    pool.initialized = initializePoolDto.initialized;
    return this.poolRepository.save(pool);
  }
}
