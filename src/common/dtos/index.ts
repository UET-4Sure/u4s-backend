import { ApiProperty } from '@nestjs/swagger';
export class GetManyResponse<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  count: number;
}

export interface PaginationQuery {
  limit?: number;
  offset?: number;
}
export function paginateData<T>(data: T[], query: PaginationQuery) {
  const total = data.length;
  const pageSize = query.limit || total;
  const offset = query.offset || 0;

  data = data.slice(offset, offset + pageSize);

  return {
    data,
    count: data.length,
    total,
    pageCount: Math.ceil(total / pageSize),
    page: Math.floor(offset / pageSize),
  };
}
