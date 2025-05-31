import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumberString,
  IsUUID,
} from 'class-validator';

export class ExecuteSwapDto {
  @ApiProperty({
    description: 'Pool ID where the swap will be executed',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  poolId: string;

  @ApiProperty({
    description: 'Address of the token being swapped in',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  tokenInAddress: string;

  @ApiProperty({
    description: 'Amount of token being swapped in',
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
    description: 'Address that initiates the swap',
    example: '0x1234567890123456789012345678901234567890',
  })
  @IsEthereumAddress()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({
    description: 'Address that will receive the swapped tokens',
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
