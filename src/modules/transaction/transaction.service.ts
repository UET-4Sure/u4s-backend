import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ethers } from 'ethers';
import { Repository } from 'typeorm';

import { EncryptionService } from '../auth/services/encryption.service';
import { User } from '../user/entities/user.entity';

import { SignMessageDto } from './dto/sign-message.dto';
import { SignTransactionDto } from './dto/sign-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private encryptionService: EncryptionService,
  ) {}

  private async validateUser(walletAddress: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if user is banned
    if (user.bannedUntil && user.bannedUntil > new Date()) {
      throw new ForbiddenException(
        `User is banned until ${user.bannedUntil.toISOString()}. Reason: ${user.banReason || 'No reason provided'}`,
      );
    }

    return user;
  }

  async signTransaction(
    dto: SignTransactionDto,
  ): Promise<{ signature: string }> {
    // Validate transaction data format
    if (!ethers.isHexString(dto.transactionData)) {
      throw new BadRequestException('Invalid transaction data format');
    }

    // Validate user and check ban status
    const user = await this.validateUser(dto.walletAddress);

    if (!user.encryptedPrivateKey || user.encryptedPrivateKey.trim() === '') {
      throw new UnauthorizedException(
        'Invalid or missing private key for this wallet',
      );
    }

    // Decrypt the private key
    const privateKey = await this.encryptionService.decrypt(
      user.encryptedPrivateKey,
    );

    // Create wallet instance
    const wallet = new ethers.Wallet(privateKey);

    // Sign the transaction data
    const signature = await wallet.signMessage(dto.transactionData);

    return { signature };
  }

  async signMessage(dto: SignMessageDto): Promise<{ signature: string }> {
    // Validate user and check ban status
    const user = await this.validateUser(dto.walletAddress);

    if (!user.encryptedPrivateKey || user.encryptedPrivateKey.trim() === '') {
      throw new UnauthorizedException(
        'Invalid or missing private key for this wallet',
      );
    }

    // Decrypt the private key
    const privateKey = await this.encryptionService.decrypt(
      user.encryptedPrivateKey,
    );

    // Create wallet instance
    const wallet = new ethers.Wallet(privateKey);

    // Sign the message
    const signature = await wallet.signMessage(dto.message);

    return { signature };
  }
}
