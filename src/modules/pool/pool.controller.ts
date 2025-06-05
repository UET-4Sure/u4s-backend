import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetManyResponse } from 'src/common/dtos';
import { GetPositionEventsDto } from '../position/dto/get-position-events.dto';
import { LiquidityEvent } from '../position/entities/liquidity-event.entity';
import { ExecuteSwapDto } from './dto/execute-swap.dto';
import { Swap } from '../swap/entities/swap.entity';
import { CreatePoolDto } from './dto/create-pool.dto';
import { GetPoolSwapsDto } from './dto/get-pool-swaps.dto';
import { GetPoolsDto } from './dto/get-pools.dto';
import { InitializePoolDto } from './dto/initialize-pool.dto';
import { Pool } from './entities/pool.entity';
import { PoolService } from './pool.service';

@ApiTags('pools')
@Controller('pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pool' })
  @ApiResponse({
    status: 201,
    description: 'Pool created successfully',
    type: Pool,
  })
  @ApiResponse({
    status: 409,
    description:
      'Pool with this address or with these tokens and fee tier already exists',
  })
  @ApiResponse({
    status: 404,
    description: 'One or both tokens not found',
  })
  create(@Body() createPoolDto: CreatePoolDto): Promise<Pool> {
    return this.poolService.create(createPoolDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all pools with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated pools with total count',
    type: GetManyResponse<Pool>,
  })
  findAll(@Query() query: GetPoolsDto): Promise<GetManyResponse<Pool>> {
    return this.poolService.findAll(query);
  }

  @Get(':address')
  @ApiOperation({ summary: 'Get pool details by address' })
  @ApiResponse({
    status: 200,
    description: 'Return pool details with all related data',
    type: Pool,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  findOne(@Param('address') address: string): Promise<Pool> {
    return this.poolService.findOne(address);
  }

  @Patch(':address/initialize')
  @ApiOperation({ summary: 'Mark a pool as initialized' })
  @ApiResponse({
    status: 200,
    description: 'Pool initialization status updated successfully',
    type: Pool,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  initialize(
    @Param('address') address: string,
    @Body() initializePoolDto: InitializePoolDto,
  ): Promise<Pool> {
    return this.poolService.initialize(address, initializePoolDto);
  }

  @Get(':address/events')
  @ApiOperation({ summary: 'List all liquidity events for a pool' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated liquidity events with total count',
    type: GetManyResponse<LiquidityEvent>,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  findPoolEvents(
    @Param('address') address: string,
    @Query() query: GetPositionEventsDto,
  ): Promise<GetManyResponse<LiquidityEvent>> {
    return this.poolService.findPoolEvents(address, query);
  }

  @Get(':address/swaps')
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
    @Param('address') address: string,
    @Query() query: GetPoolSwapsDto,
  ): Promise<GetManyResponse<Swap>> {
    return this.poolService.findPoolSwaps(address, query);
  }

  @Post(':address/swaps')
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
  executeSwap(
    @Param('address') address: string,
    @Body() executeSwapDto: ExecuteSwapDto,
  ): Promise<Swap> {
    return this.poolService.executeSwap(address, executeSwapDto);
  }
}
