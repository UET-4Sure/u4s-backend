import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class UpsertTokenPriceDto {
  @ApiProperty({
    description: 'Price in USD',
    example: '1234.5678',
  })
  @IsNumberString()
  @IsNotEmpty()
  priceUsd: string;
}
