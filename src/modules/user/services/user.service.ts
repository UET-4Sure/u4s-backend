import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { GetManyResponse, paginateData } from 'src/common/dtos';
import { EncryptionService } from 'src/modules/auth/services/encryption.service';
import { sbtClient } from 'src/script/soulboundToken';
import { uploadSBTMetadata } from 'src/services/ipfsService';

import { Swap } from '../../swap/entities/swap.entity';
import { BanUserDto } from '../dto/ban-user.dto';
import { CreateKycApplicationDto } from '../dto/create-kyc-application.dto';
import { GetWalletSwapsDto } from '../dto/get-wallet-swaps.dto';
import { KycApplicationResponseDto } from '../dto/kyc-application-response.dto';
import { KycLevel, KycStatusResponseDto } from '../dto/kyc-status-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import {
  KycProfile,
  VerificationOutcome,
} from '../entities/kyc_profile.entity';
import { User } from '../entities/user.entity';
import { UserBan } from '../entities/user_ban.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserBan)
    private userBanRepository: Repository<UserBan>,
    @InjectRepository(KycProfile)
    private kycProfileRepository: Repository<KycProfile>,
    @InjectRepository(Swap)
    private swapRepository: Repository<Swap>,
    private encryptionService: EncryptionService,
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

  async getPrivateKey(walletAddress: string): Promise<{ privateKey: string }> {
    // Find user by wallet address
    const user = await this.userRepository.findOne({
      where: { walletAddress: walletAddress.toLowerCase() },
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

    return { privateKey };
  }

  async submitKycApplication(
    walletAddress: string,
    createKycApplicationDto: CreateKycApplicationDto,
  ): Promise<KycProfile> {
    const user = await this.userRepository.findOne({
      where: { walletAddress: walletAddress.toLowerCase() },
      relations: ['kycProfile'],
    });

    if (!user) {
      throw new NotFoundException(
        `User with wallet address ${walletAddress} not found`,
      );
    }

    if (user.kycProfile) {
      throw new Error('User already has a KYC application');
    }

    // mint sbt for the user
    const tokenURI = await uploadSBTMetadata();
    await sbtClient.mint({
      to: walletAddress,
      tokenURI,
    });

    const kycProfile = this.kycProfileRepository.create({
      user,
      documentType: createKycApplicationDto.documentType,
      documentNumber: createKycApplicationDto.documentNumber,
      documentFrontImage: createKycApplicationDto.documentFrontImage,
      documentBackImage: createKycApplicationDto.documentBackImage,
      verificationOutcome: VerificationOutcome.APPROVED,
    });

    return this.kycProfileRepository.save(kycProfile);
  }

  async getKycApplications(
    walletAddress: string,
    status?: VerificationOutcome,
  ): Promise<KycApplicationResponseDto[]> {
    const user = await this.userRepository.findOne({
      where: { walletAddress: walletAddress.toLowerCase() },
      relations: ['kycProfile'],
    });

    if (!user) {
      throw new NotFoundException(
        `User with wallet address ${walletAddress} not found`,
      );
    }

    const query = this.kycProfileRepository
      .createQueryBuilder('kyc')
      .where('kyc.user_id = :userId', { userId: user.id })
      .orderBy('kyc.createdAt', 'DESC');

    if (status) {
      query.andWhere('kyc.verification_outcome = :status', { status });
    }

    const applications = await query.getMany();

    return applications.map((app) => ({
      id: app.id,
      status: app.verificationOutcome,
      documentType: app.documentType,
      documentNumber: app.documentNumber,
      walletAddress: user.walletAddress,
      documentFrontImage: app.documentFrontImage,
      documentBackImage: app.documentBackImage,
      submittedAt: app.createdAt,
      reviewedAt: app.reviewedAt,
      reviewNotes: app.reviewNotes,
    }));
  }

  async getKycStatus(walletAddress: string): Promise<KycStatusResponseDto> {
    const user = await this.userRepository.findOne({
      where: { walletAddress: walletAddress.toLowerCase() },
      relations: ['kycProfile'],
    });

    if (!user) {
      throw new NotFoundException(
        `User with wallet address ${walletAddress} not found`,
      );
    }

    // Get all applications ordered by latest first
    const applications = await this.kycProfileRepository
      .createQueryBuilder('kyc')
      .where('kyc.user_id = :userId', { userId: user.id })
      .orderBy('kyc.createdAt', 'DESC')
      .getMany();

    // Find approved application or get the latest one
    const approvedApplication = applications.find(
      (app) => app.verificationOutcome === VerificationOutcome.APPROVED,
    );
    const latestApplication = applications[0] || null;

    // Determine KYC level and which application to return
    const level = approvedApplication ? KycLevel.BASIC : KycLevel.NONE;
    const applicationToReturn = approvedApplication || latestApplication;

    return {
      level,
      latestApplication: applicationToReturn
        ? {
            id: applicationToReturn.id,
            status: applicationToReturn.verificationOutcome,
            documentType: applicationToReturn.documentType,
            documentNumber: applicationToReturn.documentNumber,
            walletAddress: user.walletAddress,
            documentFrontImage: applicationToReturn.documentFrontImage,
            documentBackImage: applicationToReturn.documentBackImage,
            submittedAt: applicationToReturn.createdAt,
            reviewedAt: applicationToReturn.reviewedAt,
            reviewNotes: applicationToReturn.reviewNotes,
          }
        : null,
    };
  }

  async findWalletSwaps(
    walletAddress: string,
    query: GetWalletSwapsDto,
  ): Promise<GetManyResponse<Swap>> {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    // Build query to find swaps where the wallet is either sender or recipient
    const qb = this.swapRepository
      .createQueryBuilder('swap')
      .leftJoinAndSelect('swap.pool', 'pool')
      .leftJoinAndSelect('pool.token0', 'token0')
      .leftJoinAndSelect('pool.token1', 'token1')
      .where(
        'swap.sender = :walletAddress OR swap.recipient = :walletAddress',
        {
          walletAddress,
        },
      )
      .orderBy('swap.timestamp', 'DESC');

    const [swaps, total] = await qb.getManyAndCount();
    const paginatedData = paginateData(swaps, { limit, offset });

    return {
      data: paginatedData.data,
      total,
      count: paginatedData.count,
    };
  }
}
