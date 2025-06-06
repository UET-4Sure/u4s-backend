import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetManyResponse } from 'src/common/dtos';

import { GetPoolVolumeMetricsDto } from './dto/get-pool-volume-metrics.dto';
import { GetTotalTvlDto } from './dto/get-total-tvl.dto';
import { GetTotalVolumeDto } from './dto/get-total-volume.dto';
import { PoolFeesMetricDto } from './dto/pool-fees-metric.dto';
import { PoolLiquidityMetricDto } from './dto/pool-liquidity-metric.dto';
import { PoolMetricsOverviewDto } from './dto/pool-metrics-overview.dto';
import { PoolVolumeMetricDto } from './dto/pool-volume-metric.dto';
import { TotalTvlMetricDto } from './dto/total-tvl-metric.dto';
import { TotalVolumeMetricDto } from './dto/total-volume-metric.dto';
import { PoolMetricsService } from './pool-metrics.service';

@ApiTags('pools')
@Controller('pools')
export class PoolMetricsController {
  constructor(private readonly poolMetricsService: PoolMetricsService) {}

  @Get(':poolAddress/metrics/overview')
  @ApiOperation({ summary: 'Get pool metrics overview' })
  @ApiResponse({
    status: 200,
    description: 'Return pool metrics overview',
    type: PoolMetricsOverviewDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  getOverview(
    @Param('poolAddress') poolAddress: string,
  ): Promise<PoolMetricsOverviewDto> {
    return this.poolMetricsService.getOverview(poolAddress);
  }

  @Get(':poolAddress/metrics/volume')
  @ApiOperation({ summary: 'Get pool volume metrics' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated volume metrics',
    type: GetManyResponse<PoolVolumeMetricDto>,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  getVolumeMetrics(
    @Param('poolAddress') poolAddress: string,
    @Query() query: GetPoolVolumeMetricsDto,
  ): Promise<GetManyResponse<PoolVolumeMetricDto>> {
    return this.poolMetricsService.getVolumeMetrics(poolAddress, query);
  }

  @Get(':poolAddress/metrics/fees')
  @ApiOperation({ summary: 'Get pool fees metrics' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated fees metrics',
    type: GetManyResponse<PoolFeesMetricDto>,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  getFeesMetrics(
    @Param('poolAddress') poolAddress: string,
    @Query() query: GetPoolVolumeMetricsDto,
  ): Promise<GetManyResponse<PoolFeesMetricDto>> {
    return this.poolMetricsService.getFeesMetrics(poolAddress, query);
  }

  @Get('metrics/pools/total-tvl')
  @ApiOperation({ summary: 'Get total TVL across all pools' })
  @ApiResponse({
    status: 200,
    description: 'Return total TVL at the specified timestamp',
    type: TotalTvlMetricDto,
  })
  getTotalTvl(@Query() query: GetTotalTvlDto): Promise<TotalTvlMetricDto> {
    return this.poolMetricsService.getTotalTvl(query.timestamp);
  }

  @Get('metrics/pools/total-volume')
  @ApiOperation({ summary: 'Get total volume across all pools' })
  @ApiResponse({
    status: 200,
    description: 'Return total volume at the specified timestamp',
    type: TotalVolumeMetricDto,
  })
  getTotalVolume(
    @Query() query: GetTotalVolumeDto,
  ): Promise<TotalVolumeMetricDto> {
    return this.poolMetricsService.getTotalVolume24h(query.asOf);
  }

  @Get(':poolAddress/metrics/liquidity')
  @ApiOperation({ summary: 'Get pool liquidity metrics' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated liquidity metrics',
    type: GetManyResponse<PoolLiquidityMetricDto>,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  getLiquidityMetrics(
    @Param('poolAddress') poolAddress: string,
    @Query() query: GetPoolVolumeMetricsDto,
  ): Promise<GetManyResponse<PoolLiquidityMetricDto>> {
    return this.poolMetricsService.getLiquidityMetrics(poolAddress, query);
  }
}
