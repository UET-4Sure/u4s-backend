import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePoolDto } from './dto/create-pool.dto';
import { Pool } from './entities/pool.entity';
import { PoolService } from './pool.service';

@ApiTags('pools')
@Controller('pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pool' })
  @ApiResponse({
    status: 201,
    description: 'Pool created successfully',
    type: Pool,
  })
  @ApiResponse({
    status: 409,
    description: 'Pool with this address already exists',
  })
  @ApiResponse({
    status: 404,
    description: 'One or both tokens not found',
  })
  create(@Body() createPoolDto: CreatePoolDto): Promise<Pool> {
    return this.poolService.create(createPoolDto);
  }
}
