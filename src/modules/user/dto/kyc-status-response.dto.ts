import { ApiProperty } from '@nestjs/swagger';

import {
  DocumentType,
  VerificationOutcome,
} from '../entities/kyc_profile.entity';

export enum KycLevel {
  NONE = 'none',
  BASIC = 'basic',
  ENHANCED = 'enhanced',
  VIP = 'vip',
}

export class LatestApplicationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({
    enum: VerificationOutcome,
    example: VerificationOutcome.PENDING,
  })
  status: VerificationOutcome;

  @ApiProperty({ enum: DocumentType, example: DocumentType.PASSPORT })
  documentType: DocumentType;

  @ApiProperty({ example: 'A12345678' })
  documentNumber: string;

  @ApiProperty({ example: '0x1234567890123456789012345678901234567890' })
  walletAddress: string;

  @ApiProperty({
    description: 'Base64 encoded image of the front side of the document',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
    nullable: true,
  })
  documentFrontImage: string | null;

  @ApiProperty({
    description: 'Base64 encoded image of the back side of the document',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
    nullable: true,
  })
  documentBackImage: string | null;

  @ApiProperty({ example: '2025-06-05T14:32:00Z' })
  submittedAt: Date;

  @ApiProperty({ example: '2025-06-06T10:00:00Z', nullable: true })
  reviewedAt: Date | null;

  @ApiProperty({ example: 'Document image is unclear', nullable: true })
  reviewNotes: string | null;

  @ApiProperty({
    example: '1234567890',
    description: 'SBT token ID associated with the KYC application',
    nullable: true,
  })
  tokenId: string | null;
}

export class KycStatusResponseDto {
  @ApiProperty({ enum: KycLevel, example: KycLevel.BASIC })
  level: KycLevel;

  @ApiProperty({ type: LatestApplicationDto, nullable: true })
  latestApplication: LatestApplicationDto | null;
}
