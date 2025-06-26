import { ApiProperty } from '@nestjs/swagger';

import {
  IsEthereumAddress,
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

export class WalletLoginDto {
  @ApiProperty({
    description: 'User wallet address',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'EIP-712 signature',
    example: '0x1234...',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({
    description: 'EIP-712 domain',
    example: {
      name: 'MyApp',
      version: '1',
      chainId: 1,
      verifyingContract: '0x...',
    },
  })
  @IsObject()
  @IsNotEmpty()
  domain: any;

  @ApiProperty({
    description: 'EIP-712 types',
    example: {
      Login: [
        { name: 'wallet', type: 'address' },
        { name: 'nonce', type: 'string' },
      ],
    },
  })
  @IsObject()
  @IsNotEmpty()
  types: any;

  @ApiProperty({
    description: 'EIP-712 message',
    example: { wallet: '0x1234...', nonce: 'random-nonce-string' },
  })
  @IsObject()
  @IsNotEmpty()
  message: any;
}
