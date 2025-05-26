import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetManyResponse } from '../../common/dtos';
import { CreateTokenDto } from './dto/create-token.dto';
import { GetTokensDto } from './dto/get-tokens.dto';
import { Token } from './entities/token.entity';
import { TokenService } from './token.service';

@ApiTags('tokens')
@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new token' })
  @ApiResponse({
    status: 201,
    description: 'Token created successfully',
    type: Token,
  })
  @ApiResponse({
    status: 409,
    description: 'Token with this address already exists',
  })
  create(@Body() createTokenDto: CreateTokenDto): Promise<Token> {
    return this.tokenService.create(createTokenDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tokens with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated tokens with total count',
    type: GetManyResponse<Token>,
  })
  findAll(@Query() query: GetTokensDto): Promise<GetManyResponse<Token>> {
    return this.tokenService.findAll(query);
  }
}
