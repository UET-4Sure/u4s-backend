import { ApiProperty } from '@nestjs/swagger';

export class PoolFeesMetricDto {
  @ApiProperty({
    description: 'Start time of the bucket',
    example: '2024-03-20T00:00:00.000Z',
  })
  bucketStart: Date;

  @ApiProperty({
    description: 'Fees in USD for this time bucket',
    example: '100.00',
  })
  feesUsd: string;
}
