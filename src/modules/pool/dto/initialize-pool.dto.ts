import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean } from 'class-validator';

export class InitializePoolDto {
  @ApiProperty({
    description: 'Whether the pool is initialized',
    example: true,
    default: true,
  })
  @IsBoolean()
  initialized: boolean = true;
}
