import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetManyResponse } from '../../common/dtos';
import { Token } from '../token/entities/token.entity';
import {
  GetTokenPriceHistoryDto,
  PriceInterval,
} from './dto/get-token-price-history.dto';
import { TokenPrice } from './entities/token-price.entity';

@Injectable()
export class TokenPriceService {
  constructor(
    @InjectRepository(TokenPrice)
    private tokenPriceRepository: Repository<TokenPrice>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async findLatest(tokenId: string): Promise<TokenPrice> {
    // Check if token exists
    const token = await this.tokenRepository.findOne({
      where: { id: tokenId },
    });

    if (!token) {
      throw new NotFoundException(`Token with ID ${tokenId} not found`);
    }

    // Find latest price
    const latestPrice = await this.tokenPriceRepository.findOne({
      where: { token: { id: tokenId } },
      order: { timestamp: 'DESC' },
    });

    if (!latestPrice) {
      throw new NotFoundException(`No price found for token ${tokenId}`);
    }

    return latestPrice;
  }

  async findHistory(
    tokenId: string,
    query: GetTokenPriceHistoryDto,
  ): Promise<GetManyResponse<TokenPrice>> {
    // Check if token exists
    const token = await this.tokenRepository.findOne({
      where: { id: tokenId },
    });

    if (!token) {
      throw new NotFoundException(`Token with ID ${tokenId} not found`);
    }

    // Build query
    const qb = this.tokenPriceRepository
      .createQueryBuilder('price')
      .leftJoinAndSelect('price.token', 'token')
      .where('token.id = :tokenId', { tokenId });

    // Apply date filters
    if (query.from) {
      qb.andWhere('price.timestamp >= :from', { from: query.from });
    }

    if (query.to) {
      qb.andWhere('price.timestamp <= :to', { to: query.to });
    }

    // Apply interval grouping
    if (query.interval === PriceInterval.DAILY) {
      qb.addSelect('DATE(price.timestamp)', 'date')
        .groupBy('date')
        .orderBy('date', 'DESC');
    } else {
      qb.orderBy('price.timestamp', 'DESC');
    }

    // Get data and total count
    const [prices, total] = await qb.getManyAndCount();

    return {
      data: prices,
      total,
      count: prices.length,
    };
  }
}
