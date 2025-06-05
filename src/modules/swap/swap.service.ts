import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetManyResponse, paginateData } from '../../common/dtos';
import { GetPoolSwapsDto } from '../pool/dto/get-pool-swaps.dto';
import { Pool } from '../pool/entities/pool.entity';
import { ExecuteSwapDto } from './dto/execute-swap.dto';
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
}
