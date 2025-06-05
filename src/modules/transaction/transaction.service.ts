import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { EncryptionService } from '../auth/services/encryption.service';
import { User } from '../user/entities/user.entity';
import { SignTransactionDto } from './dto/sign-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private encryptionService: EncryptionService,
  ) {}

  async signTransaction(
    dto: SignTransactionDto,
  ): Promise<{ signature: string }> {
    // Find user by wallet address
    const user = await this.userRepository.findOne({
      where: { walletAddress: dto.walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.encryptedPrivateKey) {
      throw new UnauthorizedException('No private key found for this wallet');
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
}
