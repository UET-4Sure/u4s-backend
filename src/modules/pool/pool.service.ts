import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../token/entities/token.entity';
import { CreatePoolDto } from './dto/create-pool.dto';
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
        token0: { id: token0.id },
        token1: { id: token1.id },
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
}
