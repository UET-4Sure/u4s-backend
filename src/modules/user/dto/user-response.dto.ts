import { ApiProperty } from '@nestjs/swagger';
import { AuthMethod, KycStatus } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: '0x123...abc' })
  walletAddress: string;

  @ApiProperty({ enum: AuthMethod, example: AuthMethod.WALLET })
  authMethod: AuthMethod;

  @ApiProperty({ example: 'user@example.com', required: false })
  email: string | null;

  @ApiProperty({ enum: KycStatus, example: KycStatus.NONE })
  kycStatus: KycStatus;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', required: false })
  bannedUntil: Date | null;

  @ApiProperty({ example: 'Violation of terms', required: false })
  banReason: string | null;
}
