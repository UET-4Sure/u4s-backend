import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetManyResponse } from '../../common/dtos';
import { Token } from '../token/entities/token.entity';
import {
  GetTokenPriceHistoryDto,
  PriceInterval,
} from './dto/get-token-price-history.dto';
import { UpsertTokenPriceDto } from './dto/upsert-token-price.dto';
import { TokenPrice } from './entities/token-price.entity';

@Injectable()
export class TokenPriceService {
  constructor(
    @InjectRepository(TokenPrice)
    private tokenPriceRepository: Repository<TokenPrice>,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async findLatest(tokenAddress: string): Promise<TokenPrice> {
    // Check if token exists
    const token = await this.tokenRepository.findOne({
      where: { address: tokenAddress },
    });

    if (!token) {
      throw new NotFoundException(
        `Token with address ${tokenAddress} not found`,
      );
    }

    // Find latest price
    const latestPrice = await this.tokenPriceRepository.findOne({
      where: { token: { address: tokenAddress } },
      order: { timestamp: 'DESC' },
    });

    if (!latestPrice) {
      throw new NotFoundException(`No price found for token ${tokenAddress}`);
    }

    return latestPrice;
  }

  async findHistory(
    tokenAddress: string,
    query: GetTokenPriceHistoryDto,
  ): Promise<GetManyResponse<TokenPrice>> {
    // Check if token exists
    const token = await this.tokenRepository.findOne({
      where: { address: tokenAddress },
    });

    if (!token) {
      throw new NotFoundException(
        `Token with address ${tokenAddress} not found`,
      );
    }

    // Build query
    const qb = this.tokenPriceRepository
      .createQueryBuilder('price')
      .leftJoinAndSelect('price.token', 'token')
      .where('token.address = :tokenAddress', { tokenAddress });

    // Apply date filters
    if (query.from) {
      qb.andWhere('price.timestamp >= :from', { from: query.from });
    }

    if (query.to) {
      qb.andWhere('price.timestamp <= :to', { to: query.to });
    }

    // Apply interval grouping
    if (query.interval === PriceInterval.DAILY) {
      const rawQuery = `
        SELECT 
          price.id as "id",
          token.id as "tokenId",
          token.address as "tokenAddress",
          token.symbol as "tokenSymbol",
          token.name as "tokenName",
          token.decimals as "tokenDecimals",
          token.created_at as "tokenCreatedAt",
          price.priceUsd as "priceUsd",
          price.timestamp as "timestamp"
        FROM token_price price
        LEFT JOIN tokens token ON token.id = price.token_id
        WHERE token.address = ?
        ${query.from ? 'AND price.timestamp >= ?' : ''}
        ${query.to ? 'AND price.timestamp <= ?' : ''}
        ORDER BY price.timestamp DESC
      `;

      const prices = await this.tokenPriceRepository.query(rawQuery, [
        tokenAddress,
        query.from,
        query.to,
      ]);

      // Map raw results to TokenPrice entities
      const mappedPrices = prices.map((price: any) => {
        const tokenPrice = new TokenPrice();
        tokenPrice.priceUsd = price.priceUsd;
        tokenPrice.timestamp = price.timestamp;
        tokenPrice.token = {
          id: price.tokenId,
          address: price.tokenAddress,
          symbol: price.tokenSymbol,
          name: price.tokenName,
          decimals: price.tokenDecimals,
          createdAt: price.tokenCreatedAt,
        } as Token;
        return tokenPrice;
      });

      return {
        data: mappedPrices,
        total: prices.length,
        count: mappedPrices.length,
      };
    } else {
      qb.orderBy('price.timestamp', 'DESC');
      const [prices, total] = await qb.getManyAndCount();
      return {
        data: prices,
        total,
        count: prices.length,
      };
    }
  }

  async upsert(
    tokenAddress: string,
    upsertTokenPriceDto: UpsertTokenPriceDto,
  ): Promise<TokenPrice> {
    // Check if token exists
    const token = await this.tokenRepository.findOne({
      where: { address: tokenAddress },
    });

    if (!token) {
      throw new NotFoundException(
        `Token with address ${tokenAddress} not found`,
      );
    }

    // Create new price record
    const price = this.tokenPriceRepository.create({
      token,
      priceUsd: upsertTokenPriceDto.priceUsd,
      timestamp: new Date(),
    });

    return this.tokenPriceRepository.save(price);
  }
}
