import { Pool } from '../entities/pool.entity';

export interface PoolResponse extends Pool {
  highVolatility: boolean;
}

export interface GetManyPoolResponse {
  data: PoolResponse[];
  total: number;
  count: number;
}
