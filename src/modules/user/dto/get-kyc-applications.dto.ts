import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { VerificationOutcome } from '../entities/kyc_profile.entity';

export class GetKycApplicationsDto {
  @ApiProperty({
    enum: VerificationOutcome,
    required: false,
    description: 'Filter applications by status',
  })
  @IsEnum(VerificationOutcome)
  @IsOptional()
  status?: VerificationOutcome;
}
