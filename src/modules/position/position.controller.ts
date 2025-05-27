import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetManyResponse } from '../../common/dtos';
import { CreatePositionDto } from './dto/create-position.dto';
import { GetPositionsDto } from './dto/get-positions.dto';
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

  @Get()
  @ApiOperation({ summary: 'List all positions with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated positions with total count',
    type: GetManyResponse<Position>,
  })
  findAll(@Query() query: GetPositionsDto): Promise<GetManyResponse<Position>> {
    return this.positionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get position details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return position details with all related data',
    type: Position,
  })
  @ApiResponse({
    status: 404,
    description: 'Position not found',
  })
  findOne(@Param('id') id: string): Promise<Position> {
    return this.positionService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Burn (close) a position' })
  @ApiResponse({
    status: 200,
    description: 'Position burned successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Position not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot burn position with existing liquidity events',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.positionService.remove(id);
  }
}
