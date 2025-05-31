import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetManyResponse } from '../../common/dtos';
import { GetPoolVolumeMetricsDto } from './dto/get-pool-volume-metrics.dto';
import { PoolFeesMetricDto } from './dto/pool-fees-metric.dto';
import { PoolMetricsOverviewDto } from './dto/pool-metrics-overview.dto';
import { PoolVolumeMetricDto } from './dto/pool-volume-metric.dto';
import { TotalTvlMetricDto } from './dto/total-tvl-metric.dto';
import { PoolMetricsService } from './pool-metrics.service';

@ApiTags('pool-metrics')
@Controller('pools')
export class PoolMetricsController {
  constructor(private readonly poolMetricsService: PoolMetricsService) {}

  @Get(':poolId/metrics/overview')
  @ApiOperation({ summary: 'Get pool metrics overview' })
  @ApiResponse({
    status: 200,
    description: 'Return pool metrics overview',
    type: PoolMetricsOverviewDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool or metrics not found',
  })
  getOverview(
    @Param('poolId') poolId: string,
  ): Promise<PoolMetricsOverviewDto> {
    return this.poolMetricsService.getOverview(poolId);
  }

  @Get(':poolId/metrics/volume')
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
    @Param('poolId') poolId: string,
    @Query() query: GetPoolVolumeMetricsDto,
  ): Promise<GetManyResponse<PoolVolumeMetricDto>> {
    return this.poolMetricsService.getVolumeMetrics(poolId, query);
  }

  @Get(':poolId/metrics/fees')
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
    @Param('poolId') poolId: string,
    @Query() query: GetPoolVolumeMetricsDto,
  ): Promise<GetManyResponse<PoolFeesMetricDto>> {
    return this.poolMetricsService.getFeesMetrics(poolId, query);
  }

  @Get('metrics/pools/total-tvl')
  @ApiOperation({ summary: 'Get total TVL across all pools' })
  @ApiResponse({
    status: 200,
    description: 'Return total TVL at the specified timestamp',
    type: TotalTvlMetricDto,
  })
  getTotalTvl(
    @Query('timestamp') timestamp?: string,
  ): Promise<TotalTvlMetricDto> {
    return this.poolMetricsService.getTotalTvl(timestamp);
  }
}
