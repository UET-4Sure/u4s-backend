import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BanUserDto } from '../dto/ban-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../entities/user.entity';
import { UserBan } from '../entities/user_ban.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserBan)
    private userBanRepository: Repository<UserBan>,
  ) {}

  async banUser(banUserDto: BanUserDto, bannedBy: string) {
    const user = await this.userRepository.findOne({
      where: { walletAddress: banUserDto.walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user's ban status
    user.bannedUntil = new Date(banUserDto.bannedUntil);
    user.banReason = banUserDto.reason ?? null;
    await this.userRepository.save(user);

    // Create ban record
    const banRecord = this.userBanRepository.create({
      user,
      bannedBy,
      reason: banUserDto.reason,
      startAt: new Date(),
      endAt: new Date(banUserDto.bannedUntil),
    });
    await this.userBanRepository.save(banRecord);

    return {
      message: 'User banned successfully',
      bannedUntil: user.bannedUntil,
      reason: user.banReason,
    };
  }

  async getUserByWallet(walletAddress: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      walletAddress: user.walletAddress,
      authMethod: user.authMethod,
      email: user.email,
      kycStatus: user.kycStatus,
      bannedUntil: user.bannedUntil,
      banReason: user.banReason,
    };
  }
}
