import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class SignTransactionDto {
  @ApiProperty({
    description: 'Transaction data to sign',
    example: '0x...',
  })
  @IsString()
  @IsNotEmpty()
  transactionData: string;

  @ApiProperty({
    description: 'Wallet address of the signer',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  walletAddress: string;
}
