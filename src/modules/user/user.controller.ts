import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BanUserDto } from './dto/ban-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './services/user.service';

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

  @Post('ban')
  async banUser(@Body() banUserDto: BanUserDto) {
    return this.userService.banUser(banUserDto, 'system');
  }
}
