import { ApiProperty } from '@nestjs/swagger';

export class TotalVolumeMetricDto {
  @ApiProperty({
    description: 'Total 24h volume across all pools in USD',
    example: '5000000.00',
  })
  totalVolume24hUsd: string;

  @ApiProperty({
    description: 'Timestamp of the measurement',
    example: '2024-03-21T00:00:00Z',
  })
  asOf: Date;
}
