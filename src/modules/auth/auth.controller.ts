import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { WalletLoginDto } from './dto/wallet-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('wallet-login')
  @ApiOperation({ summary: 'Login with EIP-712 wallet signature' })
  @ApiResponse({
    status: 201,
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
  @ApiResponse({ status: 401, description: 'Invalid EIP-712 signature' })
  @ApiResponse({ status: 403, description: 'User is banned' })
  async walletLogin(@Body() dto: WalletLoginDto) {
    return this.authService.walletLogin(dto);
  }

  @Post('oauth-login')
  @ApiOperation({ summary: 'Login with OAuth provider' })
  @ApiResponse({
    status: 201,
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
