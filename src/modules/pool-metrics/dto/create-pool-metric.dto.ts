import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePoolMetricDto {
  @ApiProperty({
    description: 'Pool address',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsString()
  @IsNotEmpty()
  poolAddress: string;

  @ApiProperty({
    description: 'Volume in USD',
    example: 1800.5,
  })
  @IsNumber()
  @IsNotEmpty()
  volumeUsd: number;

  @ApiProperty({
    description: 'Fee amount in USD',
    example: 0.3,
  })
  @IsNumber()
  @IsNotEmpty()
  feeUsd: number;

  @ApiProperty({
    description: 'Token in price in USD',
    example: 1800.5,
  })
  @IsNumber()
  @IsNotEmpty()
  tokenInPriceUsd: number;

  @ApiProperty({
    description: 'Token out price in USD',
    example: 1.0,
  })
  @IsNumber()
  @IsNotEmpty()
  tokenOutPriceUsd: number;

  @ApiProperty({
    description: 'Amount in',
    example: '1000000000000000000',
  })
  @IsString()
  @IsNotEmpty()
  amountIn: string;

  @ApiProperty({
    description: 'Amount out',
    example: '990000000000000000',
  })
  @IsString()
  @IsNotEmpty()
  amountOut: string;
}
