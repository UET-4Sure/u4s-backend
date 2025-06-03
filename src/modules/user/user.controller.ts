import { Body, Controller, Post } from '@nestjs/common';
import { BanUserDto } from './dto/ban-user.dto';
import { UserService } from './services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('ban')
  async banUser(@Body() banUserDto: BanUserDto) {
    return this.userService.banUser(banUserDto, 'system');
  }
}
