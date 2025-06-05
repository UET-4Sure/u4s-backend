import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsEthereumAddress,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  Length,
} from 'class-validator';

export class CreatePositionDto {
  @ApiProperty({
    description: 'Pool address where the position will be created',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  @Length(42, 42)
  poolAddress: string;

  @ApiProperty({
    description: 'Owner address of the position',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  ownerAddress: string;

  @ApiProperty({
    description: 'Lower tick index of the position range',
    example: -887220,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  tickLower: number;

  @ApiProperty({
    description: 'Upper tick index of the position range',
    example: 887220,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  tickUpper: number;

  @ApiProperty({
    description: 'Amount of liquidity to add',
    example: '1000000000000000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  liquidityAmount: string;
}
