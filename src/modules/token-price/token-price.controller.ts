import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
