import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class TotalTvlMetricDto {
  @ApiProperty({
    description: 'Total Value Locked in USD across all pools',
    example: '1000000.00',
  })
  totalTvlUsd: string;

  @ApiProperty({
    description: 'Timestamp of the TVL measurement',
    example: '2024-03-20T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  timestamp?: string;
}
