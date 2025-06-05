import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum PriceInterval {
  HOURLY = 'hourly',
  DAILY = 'daily',
}

export class GetTokenPriceHistoryDto {
  @ApiProperty({
    description: 'Start date (ISO string)',
    example: '2024-03-01T00:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiProperty({
    description: 'End date (ISO string)',
    example: '2024-03-21T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  to?: string;

  @ApiProperty({
    description: 'Time interval for price data',
    enum: PriceInterval,
    default: PriceInterval.DAILY,
  })
  @IsEnum(PriceInterval)
  @IsOptional()
  interval?: PriceInterval = PriceInterval.DAILY;
}
