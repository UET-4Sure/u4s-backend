import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EncryptionService } from '../auth/services/encryption.service';
import { User } from '../user/entities/user.entity';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TransactionController],
  providers: [TransactionService, EncryptionService],
})
export class TransactionModule {}
