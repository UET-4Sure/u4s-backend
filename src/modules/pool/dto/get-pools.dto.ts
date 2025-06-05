import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class GetPoolsDto {
  @ApiProperty({
    description: 'Page number (starts from 1)',
    required: false,
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by token0 address',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(42, 42)
  token0Address?: string;

  @ApiProperty({
    description: 'Filter by token1 address',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(42, 42)
  token1Address?: string;

  @ApiProperty({
    description: 'Filter by fee tier',
    required: false,
    example: 3000,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  feeTier?: number;

  @ApiProperty({
    description: 'Filter by initialization status',
    required: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  initialized?: boolean;
}
