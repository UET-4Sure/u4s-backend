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

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({
    example: 'https://cdn.example.com/kyc/scan1.jpg',
    nullable: true,
  })
  documentFrontImageUrl: string | null;

  @ApiProperty({
    example: 'https://cdn.example.com/kyc/scan2.jpg',
    nullable: true,
  })
  documentBackImageUrl: string | null;

  @ApiProperty({ example: '2025-06-05T14:32:00Z' })
  submittedAt: Date;

  @ApiProperty({ example: '2025-06-06T10:00:00Z', nullable: true })
  reviewedAt: Date | null;

  @ApiProperty({ example: 'Document image is unclear', nullable: true })
  reviewNotes: string | null;
}

export class KycStatusResponseDto {
  @ApiProperty({ enum: KycLevel, example: KycLevel.BASIC })
  level: KycLevel;

  @ApiProperty({ type: LatestApplicationDto, nullable: true })
  latestApplication: LatestApplicationDto | null;
}
