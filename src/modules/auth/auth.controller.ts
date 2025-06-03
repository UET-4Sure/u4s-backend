import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { WalletLoginDto } from './dto/wallet-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('nonce')
  @ApiOperation({ summary: 'Get nonce for wallet login' })
  @ApiResponse({
    status: 200,
    description: 'Returns a nonce for the given wallet address',
    schema: {
      type: 'object',
      properties: {
        nonce: {
          type: 'string',
          example: 'random-nonce-string',
        },
      },
    },
  })
  async getNonce(@Query('address') address: string) {
    if (!address) {
      throw new UnauthorizedException('Address is required');
    }
    const nonce = await this.authService.generateNonce(address);
    return { nonce };
  }

  @Post('wallet-login')
  @ApiOperation({ summary: 'Login with wallet signature' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGci...',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-1234' },
            walletAddress: { type: 'string', example: '0x1234...' },
            authMethod: { type: 'string', example: 'wallet' },
            kycStatus: { type: 'string', example: 'none' },
            bannedUntil: { type: 'string', example: null },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid signature or nonce' })
  @ApiResponse({ status: 403, description: 'User is banned' })
  async walletLogin(@Body() dto: WalletLoginDto) {
    return this.authService.walletLogin(dto);
  }

  @Post('oauth-login')
  @ApiOperation({ summary: 'Login with OAuth provider' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGci...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-5678' },
            walletAddress: { type: 'string', example: '0xdef456...' },
            authMethod: { type: 'string', example: 'google' },
            email: { type: 'string', example: 'alice@example.com' },
            kycStatus: { type: 'string', example: 'none' },
            bannedUntil: { type: 'string', example: null },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid OAuth token' })
  @ApiResponse({ status: 403, description: 'User is banned' })
  async oauthLogin(@Body() dto: OAuthLoginDto) {
    return this.authService.oauthLogin(dto);
  }
}
