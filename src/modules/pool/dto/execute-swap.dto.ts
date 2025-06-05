import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumberString,
  Length,
} from 'class-validator';

export class ExecuteSwapDto {
  @ApiProperty({
    description: 'Address of the token being swapped in',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  @Length(42, 42)
  tokenInAddress: string;

  @ApiProperty({
    description: 'Amount of tokens to swap',
    example: '1000000000000000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  amountIn: string;

  @ApiProperty({
    description: 'Minimum amount of token expected to receive',
    example: '990000000000000000',
  })
  @IsNumberString()
  @IsNotEmpty()
  amountOutMinimum: string;

  @ApiProperty({
    description: 'Address of the swap sender',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({
    description: 'Address of the swap recipient',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  recipient: string;

  @ApiProperty({
    description: 'Deadline timestamp for the swap',
    example: '1678901234',
  })
  @Type(() => Number)
  @IsNotEmpty()
  deadline: number;
}
