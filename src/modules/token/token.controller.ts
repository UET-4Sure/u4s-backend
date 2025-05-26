import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTokenDto } from './dto/create-token.dto';
import { Token } from './entities/token.entity';
import { TokenService } from './token.service';

@ApiTags('tokens')
@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new token' })
  @ApiResponse({
    status: 201,
    description: 'Token created successfully',
    type: Token,
  })
  @ApiResponse({
    status: 409,
    description: 'Token with this address already exists',
  })
  create(@Body() createTokenDto: CreateTokenDto): Promise<Token> {
    return this.tokenService.create(createTokenDto);
  }
}
