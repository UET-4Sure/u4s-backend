import { ApiProperty } from '@nestjs/swagger';

export class PoolMetricsOverviewDto {
  @ApiProperty({
    description: 'Total Value Locked in USD',
    example: '1000000.00',
  })
  tvlUsd: string;

  @ApiProperty({
    description: '24-hour volume in USD',
    example: '50000.00',
  })
  volume24hUsd: string;

  @ApiProperty({
    description: '24-hour fees in USD',
    example: '1500.00',
  })
  fees24hUsd: string;

  @ApiProperty({
    description: 'APR for liquidity providers',
    example: '12.5',
  })
  aprForLps: string;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2024-03-21T12:00:00Z',
  })
  lastUpdated: Date;
}
