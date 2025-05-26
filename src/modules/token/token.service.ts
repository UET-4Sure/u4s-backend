import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokenDto } from './dto/create-token.dto';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async create(createTokenDto: CreateTokenDto): Promise<Token> {
    // Check if token with this address already exists
    const existingToken = await this.tokenRepository.findOne({
      where: { address: createTokenDto.address },
    });

    if (existingToken) {
      throw new ConflictException('Token with this address already exists');
    }

    const token = this.tokenRepository.create(createTokenDto);
    return this.tokenRepository.save(token);
  }
}
