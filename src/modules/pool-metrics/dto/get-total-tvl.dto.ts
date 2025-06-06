import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class GetTotalTvlDto {
  @ApiProperty({
    description: 'Timestamp to get TVL at (optional)',
    example: '2024-03-20T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  timestamp?: string;
}
