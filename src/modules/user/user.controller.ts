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
import { CreateKycApplicationDto } from './dto/create-kyc-application.dto';
import { GetKycApplicationsDto } from './dto/get-kyc-applications.dto';
import { KycApplicationResponseDto } from './dto/kyc-application-response.dto';
import { KycStatusResponseDto } from './dto/kyc-status-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { KycProfile } from './entities/kyc_profile.entity';
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

  @Post('wallet/:walletAddress/kyc/applications')
  @ApiOperation({ summary: 'Submit a new KYC application' })
  @ApiResponse({
    status: 201,
    description: 'KYC application submitted successfully',
    type: KycProfile,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'User already has a KYC application',
  })
  submitKycApplication(
    @Param('walletAddress') walletAddress: string,
    @Body() createKycApplicationDto: CreateKycApplicationDto,
  ): Promise<KycProfile> {
    return this.userService.submitKycApplication(
      walletAddress,
      createKycApplicationDto,
    );
  }

  @Get('wallet/:walletAddress/kyc/applications')
  @ApiOperation({ summary: 'Get KYC applications for a user' })
  @ApiParam({ name: 'walletAddress', description: 'Wallet address' })
  @ApiResponse({
    status: 200,
    description: 'List of KYC applications',
    type: [KycApplicationResponseDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getKycApplications(
    @Param('walletAddress') walletAddress: string,
    @Query() query: GetKycApplicationsDto,
  ): Promise<KycApplicationResponseDto[]> {
    return this.userService.getKycApplications(walletAddress, query.status);
  }

  @Get('wallet/:walletAddress/kyc/status')
  @ApiOperation({ summary: 'Get user KYC status' })
  @ApiParam({ name: 'walletAddress', description: 'Wallet address' })
  @ApiResponse({
    status: 200,
    description: 'User KYC status',
    type: KycStatusResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getKycStatus(
    @Param('walletAddress') walletAddress: string,
  ): Promise<KycStatusResponseDto> {
    return this.userService.getKycStatus(walletAddress);
  }
}
