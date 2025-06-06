import { ApiProperty } from '@nestjs/swagger';

export class PoolVolumeMetricDto {
  @ApiProperty({
    description: 'Start time of the bucket',
    example: '2024-03-20T00:00:00.000Z',
  })
  bucketStart: Date;

  @ApiProperty({
    description: 'Volume in USD for this time bucket',
    example: '1000.00',
  })
  volumeUsd: string;
}
