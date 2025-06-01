import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { GetManyResponse, paginateData } from '../../common/dtos';
import { CreateTokenDto } from './dto/create-token.dto';
import { GetTokensDto } from './dto/get-tokens.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
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

  async findAll(query: GetTokensDto): Promise<GetManyResponse<Token>> {
    const { page = 1, limit = 10, symbol, name, address } = query;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (symbol) where.symbol = Like(`%${symbol}%`);
    if (name) where.name = Like(`%${name}%`);
    if (address) where.address = Like(`%${address}%`);

    const [tokens, _] = await this.tokenRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
    });

    const paginatedData = paginateData(tokens, { limit, offset });

    return {
      data: paginatedData.data,
      total: paginatedData.total,
      count: paginatedData.count,
    };
  }

  async update(
    address: string,
    updateTokenDto: UpdateTokenDto,
  ): Promise<Token> {
    const token = await this.tokenRepository.findOne({
      where: { address },
    });

    if (!token) {
      throw new NotFoundException(`Token with address ${address} not found`);
    }

    // Update only the provided fields
    Object.assign(token, updateTokenDto);
    return this.tokenRepository.save(token);
  }
}
