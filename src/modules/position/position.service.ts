import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pool } from '../pool/entities/pool.entity';
import { CreatePositionDto } from './dto/create-position.dto';
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
}
