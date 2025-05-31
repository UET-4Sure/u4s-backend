import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetManyResponse } from '../../common/dtos';
import { ExecuteSwapDto } from './dto/execute-swap.dto';
import { GetPoolSwapsDto } from './dto/get-pool-swaps.dto';
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

  @Get('pools/:id/swaps')
  @ApiOperation({ summary: 'List swaps in a specific pool' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated swaps with total count',
    type: GetManyResponse<Swap>,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  findPoolSwaps(
    @Param('id') id: string,
    @Query() query: GetPoolSwapsDto,
  ): Promise<GetManyResponse<Swap>> {
    return this.swapService.findPoolSwaps(id, query);
  }
}
