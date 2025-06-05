import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncryptionService } from '../auth/services/encryption.service';
import { KycProfile } from './entities/kyc_profile.entity';
import { User } from './entities/user.entity';
import { UserBan } from './entities/user_ban.entity';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserBan, KycProfile])],
  controllers: [UserController],
  providers: [UserService, EncryptionService],
  exports: [UserService],
})
export class UserModule {}
