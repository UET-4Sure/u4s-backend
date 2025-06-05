import { ApiProperty } from '@nestjs/swagger';

import {
  DocumentType,
  VerificationOutcome,
} from '../entities/kyc_profile.entity';

export class KycApplicationResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({
    enum: VerificationOutcome,
    example: VerificationOutcome.APPROVED,
  })
  status: VerificationOutcome;

  @ApiProperty({ enum: DocumentType, example: DocumentType.PASSPORT })
  documentType: DocumentType;

  @ApiProperty({ example: 'A12345678' })
  documentNumber: string;

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

  @ApiProperty({ example: '2025-05-20T09:15:00Z' })
  submittedAt: Date;

  @ApiProperty({ example: '2025-05-22T11:45:00Z', nullable: true })
  reviewedAt: Date | null;

  @ApiProperty({
    example: 'Blurry photo—unable to read passport number.',
    nullable: true,
  })
  reviewNotes: string | null;
}
