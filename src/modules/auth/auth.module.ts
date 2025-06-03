import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../../config';
import { User } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EncryptionService } from './services/encryption.service';
import { OAuthService } from './services/oauth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: env.auth.jwt.secret,
      signOptions: { expiresIn: undefined },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OAuthService, EncryptionService],
  exports: [AuthService],
})
export class AuthModule {}
