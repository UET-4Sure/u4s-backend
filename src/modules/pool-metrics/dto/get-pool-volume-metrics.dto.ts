import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum TimeInterval {
  SECOND = 'second',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export class GetPoolVolumeMetricsDto {
  @ApiProperty({
    description: 'Time interval for metrics (hour/day/week/month/year)',
    enum: TimeInterval,
    default: TimeInterval.DAY,
    example: 'day',
  })
  @IsEnum(TimeInterval)
  @IsOptional()
  interval?: TimeInterval = TimeInterval.DAY;

  @ApiProperty({
    description: 'Number of data points to return',
    required: false,
    default: 24,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 24;
}
