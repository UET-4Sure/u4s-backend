import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BanUserDto } from './dto/ban-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './services/user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('wallet/:address')
  @ApiOperation({ summary: 'Get user by wallet address' })
  @ApiParam({ name: 'address', description: 'Wallet address' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByWallet(@Param('address') address: string) {
    return this.userService.getUserByWallet(address);
  }

  @Get('private-key')
  @ApiOperation({ summary: 'Get private key for wallet' })
  @ApiResponse({
    status: 200,
    description: 'Private key retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        privateKey: {
          type: 'string',
          example: '0x...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPrivateKey(@Query('walletAddress') walletAddress: string) {
    if (!walletAddress) {
      throw new UnauthorizedException('Wallet address is required');
    }
    return this.userService.getPrivateKey(walletAddress);
  }

  @Post('ban')
  async banUser(@Body() banUserDto: BanUserDto) {
    return this.userService.banUser(banUserDto, 'system');
  }
}
