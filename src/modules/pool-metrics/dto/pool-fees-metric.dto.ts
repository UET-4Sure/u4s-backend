import { ApiProperty } from '@nestjs/swagger';

export class PoolFeesMetricDto {
  @ApiProperty({
    description: 'Start time of the bucket',
    example: '2024-03-21T00:00:00Z',
  })
  bucketStart: Date;

  @ApiProperty({
    description: '24-hour fees in USD',
    example: '1000.00',
  })
  fees24hUsd: string;
}
