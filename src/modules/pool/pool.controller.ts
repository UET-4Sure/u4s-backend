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
import { GetManyResponse } from '../../common/dtos';
import { CreatePoolDto } from './dto/create-pool.dto';
import { GetPoolTicksDto } from './dto/get-pool-ticks.dto';
import { GetPoolsDto } from './dto/get-pools.dto';
import { InitializePoolDto } from './dto/initialize-pool.dto';
import { PoolTick } from './entities/pool-tick.entity';
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
    description: 'Pool with these tokens and fee tier already exists',
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

  @Get(':id')
  @ApiOperation({ summary: 'Get pool details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return pool details with all related data',
    type: Pool,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  findOne(@Param('id') id: string): Promise<Pool> {
    return this.poolService.findOne(id);
  }

  @Patch(':id/initialize')
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
    @Param('id') id: string,
    @Body() initializePoolDto: InitializePoolDto,
  ): Promise<Pool> {
    return this.poolService.initialize(id, initializePoolDto);
  }

  @Get(':id/ticks')
  @ApiOperation({ summary: 'List all ticks for a pool' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated ticks with total count',
    type: GetManyResponse<PoolTick>,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  findTicks(
    @Param('id') id: string,
    @Query() query: GetPoolTicksDto,
  ): Promise<GetManyResponse<PoolTick>> {
    return this.poolService.findTicks(id, query);
  }

  @Get(':id/ticks/:tickIndex')
  @ApiOperation({ summary: "Get one tick's liquidity state" })
  @ApiResponse({
    status: 200,
    description: 'Return tick details',
    type: PoolTick,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool or tick not found',
  })
  findTick(
    @Param('id') id: string,
    @Param('tickIndex') tickIndex: number,
  ): Promise<PoolTick> {
    return this.poolService.findTick(id, tickIndex);
  }
}
