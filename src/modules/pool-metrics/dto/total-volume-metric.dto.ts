import { ApiProperty } from '@nestjs/swagger';

export class TotalVolumeMetricDto {
  @ApiProperty({
    description: 'Total volume in USD across all pools',
    example: '1000000.00',
  })
  totalVolumeUsd: string;

  @ApiProperty({
    description: 'Timestamp of the volume measurement',
    example: '2024-03-20T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  asOf?: string;
}
