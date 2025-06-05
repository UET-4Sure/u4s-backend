import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExecuteSwapDto } from './dto/execute-swap.dto';
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
}
