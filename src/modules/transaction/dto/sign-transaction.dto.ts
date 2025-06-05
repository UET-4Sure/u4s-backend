import { ApiProperty } from '@nestjs/swagger';

import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class SignTransactionDto {
  @ApiProperty({
    description:
      'Transaction data to sign in hexadecimal format (must start with 0x)',
    example: '0x1234567890abcdef',
    pattern: '^0x[a-fA-F0-9]+$',
    minLength: 3,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  transactionData: string;

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
