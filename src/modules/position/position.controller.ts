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
import { CreateLiquidityEventDto } from './dto/create-liquidity-event.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { GetPositionEventsDto } from './dto/get-position-events.dto';
import { GetPositionsDto } from './dto/get-positions.dto';
import { LiquidityEvent } from './entities/liquidity-event.entity';
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

  @Get(':id/events')
  @ApiOperation({ summary: 'List mint/burn events for a given position' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated liquidity events with total count',
    type: GetManyResponse<LiquidityEvent>,
  })
  @ApiResponse({
    status: 404,
    description: 'Position not found',
  })
  findEvents(
    @Param('id') id: string,
    @Query() query: GetPositionEventsDto,
  ): Promise<GetManyResponse<LiquidityEvent>> {
    return this.positionService.findEvents(id, query);
  }

  @Post(':id/events')
  @ApiOperation({ summary: 'Add a new liquidity event to a position' })
  @ApiResponse({
    status: 201,
    description: 'Liquidity event created successfully',
    type: LiquidityEvent,
  })
  @ApiResponse({
    status: 404,
    description: 'Position not found',
  })
  createLiquidityEvent(
    @Param('id') id: string,
    @Body() createLiquidityEventDto: CreateLiquidityEventDto,
  ): Promise<LiquidityEvent> {
    return this.positionService.createLiquidityEvent(
      id,
      createLiquidityEventDto,
    );
  }
}
