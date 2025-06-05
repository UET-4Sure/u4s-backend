import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsEthereumAddress,
  IsInt,
  IsOptional,
  Length,
  Max,
  Min,
} from 'class-validator';

export class GetPositionsDto {
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
    description: 'Filter positions by owner address',
    required: false,
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsOptional()
  ownerAddress?: string;

  @ApiProperty({
    description: 'Filter positions by pool address',
    required: false,
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsOptional()
  @Length(42, 42)
  poolAddress?: string;
}
