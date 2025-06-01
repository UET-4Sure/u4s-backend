import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthMethod } from '../../user/entities/user.entity';

export class OAuthLoginDto {
  @ApiProperty({
    description: 'OAuth provider',
    enum: AuthMethod,
    example: 'google',
  })
  @IsEnum(AuthMethod)
  @IsNotEmpty()
  provider: AuthMethod;

  @ApiProperty({
    description: 'OAuth access token',
    example: 'ya29.a0AR...',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
