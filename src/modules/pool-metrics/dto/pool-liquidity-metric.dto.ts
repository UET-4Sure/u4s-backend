import { ApiProperty } from '@nestjs/swagger';

export class PoolLiquidityMetricDto {
  @ApiProperty({
    description: 'Start time of the bucket',
    example: '2024-03-21T00:00:00Z',
  })
  bucketStart: Date;

  @ApiProperty({
    description: 'Pool liquidity',
    example: '1000000.00',
  })
  liquidity: string;
}
