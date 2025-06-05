import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsEthereumAddress,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class GetPoolSwapsDto {
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
    description: 'Filter swaps by sender address',
    required: false,
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsOptional()
  sender?: string;

  @ApiProperty({
    description: 'Filter swaps by recipient address',
    required: false,
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsOptional()
  recipient?: string;
}
