import { ApiProperty } from '@nestjs/swagger';

import { Pool } from '../entities/pool.entity';

export class PoolResponseDto extends Pool {
  @ApiProperty({
    description:
      'Indicates if the pool has high volatility (>20% price change in last hour)',
    example: true,
  })
  highVolatility: boolean;
}

export class GetManyPoolResponseDto {
  @ApiProperty({ type: [PoolResponseDto] })
  data: PoolResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  count: number;
}
