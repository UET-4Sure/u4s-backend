import { ApiProperty } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignMessageDto {
  @ApiProperty({
    description:
      'Message to sign (plain text, will be converted to a signable message)',
    example: 'Hello, World!',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  message: string;

  @ApiProperty({
    description:
      'Wallet address of the signer (must be a valid Ethereum address)',
    example: '0x1234567890123456789012345678901234567890',
    pattern: '^0x[a-fA-F0-9]{40}$',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  walletAddress: string;
}
