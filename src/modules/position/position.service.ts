import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { GetManyResponse, paginateData } from 'src/common/dtos';

import { Pool } from '../pool/entities/pool.entity';

import { CreateLiquidityEventDto } from './dto/create-liquidity-event.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { GetPositionEventsDto } from './dto/get-position-events.dto';
import { GetPositionsDto } from './dto/get-positions.dto';
import { LiquidityEvent } from './entities/liquidity-event.entity';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
    @InjectRepository(Pool)
    private poolRepository: Repository<Pool>,
    @InjectRepository(LiquidityEvent)
    private liquidityEventRepository: Repository<LiquidityEvent>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    // Check if pool exists
    const pool = await this.poolRepository.findOne({
      where: { address: createPositionDto.poolAddress },
    });

    if (!pool) {
      throw new NotFoundException(
        `Pool with address ${createPositionDto.poolAddress} not found`,
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
    const { page = 1, limit = 10, ownerAddress, poolAddress } = query;
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

    if (poolAddress) {
      qb.andWhere('pool.address = :poolAddress', { poolAddress });
    }

    const [positions, total] = await qb.getManyAndCount();
    const paginatedData = paginateData(positions, { limit, offset });

    return {
      data: paginatedData.data,
      total: paginatedData.total,
      count: paginatedData.count,
    };
  }

  async findOne(id: string): Promise<Position> {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['pool', 'pool.token0', 'pool.token1', 'liquidityEvents'],
    });

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    return position;
  }

  async remove(id: string): Promise<void> {
    const position = await this.positionRepository.findOne({
      where: { id },
      relations: ['liquidityEvents'],
    });

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    // Check if position has any liquidity events
    if (position.liquidityEvents && position.liquidityEvents.length > 0) {
      throw new Error('Cannot burn position with existing liquidity events');
    }

    // Delete the position
    await this.positionRepository.remove(position);
  }

  async findEvents(
    id: string,
    query: GetPositionEventsDto,
  ): Promise<GetManyResponse<LiquidityEvent>> {
    // Check if position exists
    const position = await this.positionRepository.findOne({
      where: { id },
    });

    if (!position) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }

    const { page = 1, limit = 10, type } = query;
    const offset = (page - 1) * limit;

    const qb = this.liquidityEventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.position', 'position')
      .where('position.id = :positionId', { positionId: id })
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

  async createLiquidityEvent(
    positionId: string,
    createLiquidityEventDto: CreateLiquidityEventDto,
  ): Promise<LiquidityEvent> {
    // Check if position exists
    const position = await this.positionRepository.findOne({
      where: { id: positionId },
    });

    if (!position) {
      throw new NotFoundException(`Position with ID ${positionId} not found`);
    }

    // Create new liquidity event
    const liquidityEvent = this.liquidityEventRepository.create({
      position,
      type: createLiquidityEventDto.type,
      liquidityAmount: createLiquidityEventDto.liquidityAmount,
      amount0: createLiquidityEventDto.amount0,
      amount1: createLiquidityEventDto.amount1,
      txHash: createLiquidityEventDto.txHash,
    });

    return this.liquidityEventRepository.save(liquidityEvent);
  }
}
