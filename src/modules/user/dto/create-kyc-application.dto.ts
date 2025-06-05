import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';

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
    description: 'URL of the front side of the document',
    example: 'https://cdn.example.com/kyc/scan1.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  documentFrontImageUrl: string;

  @ApiProperty({
    description: 'URL of the back side of the document',
    example: 'https://cdn.example.com/kyc/scan2.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  documentBackImageUrl: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;
}
