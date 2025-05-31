import { ApiProperty } from '@nestjs/swagger';

export class TotalTvlMetricDto {
  @ApiProperty({
    description: 'Total TVL across all pools in USD',
    example: '10000000.00',
  })
  totalTvlUsd: string;

  @ApiProperty({
    description: 'Timestamp of the measurement',
    example: '2024-03-21T00:00:00Z',
  })
  timestamp: Date;
}
