import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetManyResponse } from '../../common/dtos';
import { GetPoolSwapsDto } from '../pool/dto/get-pool-swaps.dto';
import { ExecuteSwapDto } from './dto/execute-swap.dto';
import { GetWalletSwapsDto } from './dto/get-wallet-swaps.dto';
import { Swap } from './entities/swap.entity';
import { SwapService } from './swap.service';

@ApiTags('swaps')
@Controller('swaps')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Post()
  @ApiOperation({ summary: 'Execute a swap in a pool' })
  @ApiResponse({
    status: 201,
    description: 'Swap executed successfully',
    type: Swap,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid swap parameters',
  })
  execute(@Body() executeSwapDto: ExecuteSwapDto): Promise<Swap> {
    return this.swapService.execute(executeSwapDto);
  }

  @Get('wallets/:address')
  @ApiOperation({ summary: 'List all swaps for a specific wallet address' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated swaps with total count',
    type: GetManyResponse<Swap>,
  })
  findWalletSwaps(
    @Param('address') address: string,
    @Query() query: GetWalletSwapsDto,
  ): Promise<GetManyResponse<Swap>> {
    return this.swapService.findWalletSwaps(address, query);
  }
}
