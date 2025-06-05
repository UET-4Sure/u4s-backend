import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetManyResponse } from 'src/common/dtos';

import { GetTokenPriceHistoryDto } from './dto/get-token-price-history.dto';
import { UpsertTokenPriceDto } from './dto/upsert-token-price.dto';
import { TokenPrice } from './entities/token-price.entity';
import { TokenPriceService } from './token-price.service';

@ApiTags('token-prices')
@Controller('token-prices')
export class TokenPriceController {
  constructor(private readonly tokenPriceService: TokenPriceService) {}

  @Get(':tokenAddress/latest')
  @ApiOperation({ summary: 'Get latest USD price for a token' })
  @ApiResponse({
    status: 200,
    description: 'Return the latest token price',
    type: TokenPrice,
  })
  @ApiResponse({
    status: 404,
    description: 'Token or price not found',
  })
  findLatest(@Param('tokenAddress') tokenAddress: string): Promise<TokenPrice> {
    return this.tokenPriceService.findLatest(tokenAddress);
  }

  @Get(':tokenAddress/history')
  @ApiOperation({ summary: 'Get price history for a token' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated price history',
    type: GetManyResponse<TokenPrice>,
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
  })
  findHistory(
    @Param('tokenAddress') tokenAddress: string,
    @Query() query: GetTokenPriceHistoryDto,
  ): Promise<GetManyResponse<TokenPrice>> {
    return this.tokenPriceService.findHistory(tokenAddress, query);
  }

  @Post(':tokenAddress')
  @ApiOperation({ summary: 'Upsert a new price for a token' })
  @ApiResponse({
    status: 201,
    description: 'Price upserted successfully',
    type: TokenPrice,
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
  })
  upsert(
    @Param('tokenAddress') tokenAddress: string,
    @Body() upsertTokenPriceDto: UpsertTokenPriceDto,
  ): Promise<TokenPrice> {
    return this.tokenPriceService.upsert(tokenAddress, upsertTokenPriceDto);
  }
}
