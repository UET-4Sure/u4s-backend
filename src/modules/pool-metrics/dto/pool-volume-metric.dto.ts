import { ApiProperty } from '@nestjs/swagger';

export class PoolVolumeMetricDto {
  @ApiProperty({
    description: 'Start time of the bucket',
    example: '2024-03-21T00:00:00Z',
  })
  bucketStart: Date;

  @ApiProperty({
    description: '24-hour volume in USD',
    example: '50000.00',
  })
  volume24hUsd: string;

  @ApiProperty({
    description: '24-hour fees in USD',
    example: '250.00',
  })
  fees24hUsd: string;

  @ApiProperty({
    description: 'Total Value Locked in USD',
    example: '1000000.00',
  })
  tvlUsd: string;

  @ApiProperty({
    description: 'Token price ratio (token1/token0)',
    example: '1.234567890000000000',
  })
  priceRatio: string;

  @ApiProperty({
    description: 'Pool liquidity',
    example: '1000000.00',
  })
  liquidity: string;

  @ApiProperty({
    description: 'Annual Percentage Rate for Liquidity Providers',
    example: '12.5',
  })
  aprForLps: string;
}
