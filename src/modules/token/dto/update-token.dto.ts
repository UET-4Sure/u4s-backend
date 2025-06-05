import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateTokenDto {
  @ApiProperty({
    description: 'Token symbol (max 20 characters)',
    example: 'ETH',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  symbol?: string;

  @ApiProperty({
    description: 'Token name (max 100 characters)',
    example: 'Ethereum',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @ApiProperty({
    description: 'Token decimals',
    example: 18,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  decimals?: number;
}
