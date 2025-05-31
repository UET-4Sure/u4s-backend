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
}
