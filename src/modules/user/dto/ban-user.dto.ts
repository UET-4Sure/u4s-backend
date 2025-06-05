import { ApiProperty } from '@nestjs/swagger';

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class BanUserDto {
  @ApiProperty({
    description: 'Wallet address of the user to ban',
    example: '0x123...abc',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({
    description: 'Ban end date',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsNotEmpty()
  bannedUntil: string;

  @ApiProperty({
    description: 'Reason for banning the user',
    example: 'Violation of terms of service',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
