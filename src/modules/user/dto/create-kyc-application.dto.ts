import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

import { DocumentType } from '../entities/kyc_profile.entity';

export class CreateKycApplicationDto {
  @ApiProperty({
    description: 'Type of document submitted for KYC',
    enum: DocumentType,
    example: DocumentType.PASSPORT,
  })
  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType: DocumentType;

  @ApiProperty({
    description: 'Document identification number',
    example: 'A12345678',
  })
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiProperty({
    description: 'Base64 encoded image of the front side of the document',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
    message:
      'Document front image must be a valid base64 encoded image (JPEG/PNG)',
  })
  documentFrontImage: string;

  @ApiProperty({
    description: 'Base64 encoded image of the back side of the document',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
    message:
      'Document back image must be a valid base64 encoded image (JPEG/PNG)',
  })
  documentBackImage: string;
}
