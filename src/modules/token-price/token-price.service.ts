import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../token/entities/token.entity';
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
}
