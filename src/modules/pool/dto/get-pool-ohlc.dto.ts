import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsEnum,
  IsISO8601,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export enum TimeFrame {
  MINUTE = '1m',
  HOUR = '1h',
  DAY = '1d',
  WEEK = '1w',
}

export class GetPoolOhlcDto {
  @ApiProperty({
    description: 'Start time in ISO 8601 format',
    example: '2024-01-01T00:00:00Z',
  })
  @IsISO8601()
  startTime: string;

  @ApiProperty({
    description: 'End time in ISO 8601 format',
    example: '2024-01-02T00:00:00Z',
  })
  @IsISO8601()
  endTime: string;

  @ApiProperty({
    description: 'Time frame for OHLC data',
    enum: TimeFrame,
    default: TimeFrame.HOUR,
  })
  @IsEnum(TimeFrame)
  @IsOptional()
  timeFrame?: TimeFrame = TimeFrame.HOUR;

  @ApiProperty({
    description: 'Maximum number of data points to return',
    default: 100,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number = 100;
}
