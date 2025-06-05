import { ApiProperty } from '@nestjs/swagger';

import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePoolDto {
  @ApiProperty({
    description: 'Address of the first token in the pool',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsString()
  @IsNotEmpty()
  @Length(42, 42)
  token0Address: string;

  @ApiProperty({
    description: 'Address of the second token in the pool',
    example: '0x0987654321098765432109876543210987654321',
  })
  @IsString()
  @IsNotEmpty()
  @Length(42, 42)
  token1Address: string;

  @ApiProperty({
    description: 'Fee tier of the pool (e.g., 3000 for 0.3%)',
    example: 3000,
  })
  @IsInt()
  @IsNotEmpty()
  feeTier: number;

  @ApiProperty({
    description: 'Tick spacing of the pool',
    example: 60,
  })
  @IsInt()
  @IsNotEmpty()
  tickSpacing: number;

  @ApiProperty({
    description: 'Address of the hook contract (optional)',
    example: '0xabcdef1234567890abcdef1234567890abcdef12',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(42, 42)
  hookAddress?: string;

  @ApiProperty({
    description: 'Whether the pool is initialized',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  initialized?: boolean = false;

  @ApiProperty({
    description: 'Address of the pool contract',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsString()
  @IsNotEmpty()
  @Length(42, 42)
  address: string;
}
