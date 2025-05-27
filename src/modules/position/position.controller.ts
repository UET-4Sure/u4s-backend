import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePositionDto } from './dto/create-position.dto';
import { Position } from './entities/position.entity';
import { PositionService } from './position.service';

@ApiTags('positions')
@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @ApiOperation({ summary: 'Mint (open) a new liquidity position' })
  @ApiResponse({
    status: 201,
    description: 'Position created successfully',
    type: Position,
  })
  @ApiResponse({
    status: 404,
    description: 'Pool not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid tick range or input data',
  })
  create(@Body() createPositionDto: CreatePositionDto): Promise<Position> {
    return this.positionService.create(createPositionDto);
  }
}
