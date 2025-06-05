import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsNumberString, Length } from 'class-validator';

import { LiquidityEventType } from '../entities/liquidity-event.entity';

export class CreateLiquidityEventDto {
  @ApiProperty({
    description: 'Type of liquidity event (MINT or BURN)',
    enum: LiquidityEventType,
    example: LiquidityEventType.MINT,
  })
  @IsEnum(LiquidityEventType)
  @IsNotEmpty()
  type: LiquidityEventType;

  @ApiProperty({
    description: 'Amount of liquidity added/removed',
    example: '1000000000000000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  liquidityAmount: string;

  @ApiProperty({
    description: 'Amount of token0',
    example: '1000000000000000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  amount0: string;

  @ApiProperty({
    description: 'Amount of token1',
    example: '1000000000000000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  amount1: string;

  @ApiProperty({
    description: 'Transaction hash of the event',
    example:
      '0x1234567890123456789012345678901234567890123456789012345678901234',
  })
  @IsNotEmpty()
  @Length(66, 66)
  txHash: string;
}
