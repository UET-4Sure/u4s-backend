import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetManyResponse } from '../../common/dtos';
import { GetTokenPriceHistoryDto } from './dto/get-token-price-history.dto';
import { TokenPrice } from './entities/token-price.entity';
import { TokenPriceService } from './token-price.service';

@ApiTags('token-prices')
@Controller('token-prices')
export class TokenPriceController {
  constructor(private readonly tokenPriceService: TokenPriceService) {}

  @Get(':tokenId/latest')
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
  findLatest(@Param('tokenId') tokenId: string): Promise<TokenPrice> {
    return this.tokenPriceService.findLatest(tokenId);
  }

  @Get(':tokenId/history')
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
    @Param('tokenId') tokenId: string,
    @Query() query: GetTokenPriceHistoryDto,
  ): Promise<GetManyResponse<TokenPrice>> {
    return this.tokenPriceService.findHistory(tokenId, query);
  }
}
