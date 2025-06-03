import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthMethod } from '../../user/entities/user.entity';

export class OAuthLoginDto {
  @ApiProperty({
    description: 'OAuth provider',
    enum: AuthMethod,
    enumName: 'AuthMethod',
    example: AuthMethod.GOOGLE,
    examples: [
      { value: AuthMethod.GOOGLE, description: 'Google OAuth' },
      { value: AuthMethod.FACEBOOK, description: 'Facebook OAuth' },
    ],
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
