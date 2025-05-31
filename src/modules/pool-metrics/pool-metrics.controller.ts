import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PoolMetricsOverviewDto } from './dto/pool-metrics-overview.dto';
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
}
