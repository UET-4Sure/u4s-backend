import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class WalletLoginDto {
  @ApiProperty({
    description: 'User wallet address',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Signature of the nonce',
    example: '0x1234...',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;

  @ApiProperty({
    description: 'Nonce used for signature',
    example: 'random-nonce-string',
  })
  @IsString()
  @IsNotEmpty()
  nonce: string;
}
