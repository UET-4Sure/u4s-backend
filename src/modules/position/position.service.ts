import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetManyResponse, paginateData } from '../../common/dtos';
import { Pool } from '../pool/entities/pool.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { GetPositionsDto } from './dto/get-positions.dto';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(Pool)
    private poolRepository: Repository<Pool>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    // Check if pool exists
    const pool = await this.poolRepository.findOne({
      where: { id: createPositionDto.poolId },
    });

    if (!pool) {
      throw new NotFoundException(
        `Pool with ID ${createPositionDto.poolId} not found`,
      );
    }

    // Validate tick range
    if (createPositionDto.tickLower >= createPositionDto.tickUpper) {
      throw new Error('tickLower must be less than tickUpper');
    }

    // Create new position
    const position = this.positionRepository.create({
      pool,
      ownerAddress: createPositionDto.ownerAddress,
      tickLower: createPositionDto.tickLower,
      tickUpper: createPositionDto.tickUpper,
      liquidityAmount: createPositionDto.liquidityAmount,
      feeGrowth0: '0',
      feeGrowth1: '0',
    });

    return this.positionRepository.save(position);
  }

  async findAll(query: GetPositionsDto): Promise<GetManyResponse<Position>> {
    const { page = 1, limit = 10, ownerAddress, poolId } = query;
    const offset = (page - 1) * limit;

    const qb = this.positionRepository
      .createQueryBuilder('position')
      .leftJoinAndSelect('position.pool', 'pool')
      .leftJoinAndSelect('pool.token0', 'token0')
      .leftJoinAndSelect('pool.token1', 'token1')
      .orderBy('position.createdAt', 'DESC');

    if (ownerAddress) {
      qb.andWhere('position.ownerAddress = :ownerAddress', { ownerAddress });
    }

    if (poolId) {
      qb.andWhere('pool.id = :poolId', { poolId });
    }

    const [positions, total] = await qb.getManyAndCount();
    const paginatedData = paginateData(positions, { limit, offset });

    return {
      data: paginatedData.data,
      total: paginatedData.total,
      count: paginatedData.count,
    };
  }
}
