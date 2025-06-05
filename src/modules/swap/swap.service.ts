import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetManyResponse, paginateData } from '../../common/dtos';
import { Pool } from '../pool/entities/pool.entity';
import { ExecuteSwapDto } from './dto/execute-swap.dto';
import { GetPoolSwapsDto } from './dto/get-pool-swaps.dto';
import { GetWalletSwapsDto } from './dto/get-wallet-swaps.dto';
import { Swap } from './entities/swap.entity';

@Injectable()
export class SwapService {
  constructor(
    @InjectRepository(Swap)
    private swapRepository: Repository<Swap>,
    @InjectRepository(Pool)
    private poolRepository: Repository<Pool>,
  ) {}

  async execute(executeSwapDto: ExecuteSwapDto): Promise<Swap> {
    // Find the pool
    const pool = await this.poolRepository.findOne({
      where: { address: executeSwapDto.poolAddress },
      relations: ['token0', 'token1'],
    });

    if (!pool) {
      throw new NotFoundException(
        `Pool with address ${executeSwapDto.poolAddress} not found`,
      );
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

  async findPoolSwaps(
    poolAddress: string,
    query: GetPoolSwapsDto,
  ): Promise<GetManyResponse<Swap>> {
    // Check if pool exists
    const pool = await this.poolRepository.findOne({
      where: { address: poolAddress },
    });

    if (!pool) {
      throw new NotFoundException(`Pool with address ${poolAddress} not found`);
    }

    // Build query
    const qb = this.swapRepository
      .createQueryBuilder('swap')
      .leftJoinAndSelect('swap.pool', 'pool')
      .where('pool.address = :poolAddress', { poolAddress });

    // Apply filters
    if (query.sender) {
      qb.andWhere('swap.sender = :sender', { sender: query.sender });
    }

    if (query.recipient) {
      qb.andWhere('swap.recipient = :recipient', {
        recipient: query.recipient,
      });
    }

    // Order by timestamp descending (most recent first)
    qb.orderBy('swap.timestamp', 'DESC');

    // Get data and total count
    const [swaps, total] = await qb.getManyAndCount();
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    // Apply pagination
    return paginateData(swaps, { limit, offset });
  }

  async findWalletSwaps(
    walletAddress: string,
    query: GetWalletSwapsDto,
  ): Promise<GetManyResponse<Swap>> {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    // Build query to find swaps where the wallet is either sender or recipient
    const qb = this.swapRepository
      .createQueryBuilder('swap')
      .leftJoinAndSelect('swap.pool', 'pool')
      .leftJoinAndSelect('pool.token0', 'token0')
      .leftJoinAndSelect('pool.token1', 'token1')
      .where(
        'swap.sender = :walletAddress OR swap.recipient = :walletAddress',
        {
          walletAddress,
        },
      )
      .orderBy('swap.timestamp', 'DESC');

    const [swaps, total] = await qb.getManyAndCount();
    const paginatedData = paginateData(swaps, { limit, offset });

    return {
      data: paginatedData.data,
      total: paginatedData.total,
      count: paginatedData.count,
    };
  }
}
