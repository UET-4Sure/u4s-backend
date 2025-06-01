import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { AuthMethod, KycStatus, User } from '../user/entities/user.entity';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { WalletLoginDto } from './dto/wallet-login.dto';
import { EncryptionService } from './services/encryption.service';
import { OAuthService } from './services/oauth.service';

@Injectable()
export class AuthService {
  private nonceMap: Map<string, { nonce: string; timestamp: number }> =
    new Map();
  private readonly NONCE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private oauthService: OAuthService,
    private encryptionService: EncryptionService,
  ) {}

  async generateNonce(address: string): Promise<string> {
    const nonce = randomBytes(32).toString('hex');
    this.nonceMap.set(address.toLowerCase(), {
      nonce,
      timestamp: Date.now(),
    });
    return nonce;
  }

  private verifyNonce(address: string, nonce: string): boolean {
    const stored = this.nonceMap.get(address.toLowerCase());
    if (!stored) return false;

    const isExpired = Date.now() - stored.timestamp > this.NONCE_EXPIRY;
    if (isExpired) {
      this.nonceMap.delete(address.toLowerCase());
      return false;
    }

    return stored.nonce === nonce;
  }

  private verifySignature(
    address: string,
    signature: string,
    nonce: string,
  ): boolean {
    try {
      const recoveredAddress = ethers.verifyMessage(nonce, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  async walletLogin(dto: WalletLoginDto) {
    const { address, signature, nonce } = dto;

    // Verify nonce
    if (!this.verifyNonce(address, nonce)) {
      throw new UnauthorizedException('Invalid or expired nonce');
    }

    // Verify signature
    if (!this.verifySignature(address, signature, nonce)) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Find or create user
    let user = await this.userRepository.findOne({
      where: { walletAddress: address.toLowerCase() },
    });

    if (!user) {
      user = this.userRepository.create({
        walletAddress: address.toLowerCase(),
        authMethod: AuthMethod.WALLET,
        encryptedPrivateKey: null,
      });
      await this.userRepository.save(user);
    }

    // Check if user is banned
    if (user.bannedUntil && user.bannedUntil > new Date()) {
      throw new ForbiddenException(
        `User is banned until ${user.bannedUntil.toISOString()}`,
      );
    }

    // Generate JWT
    const token = this.jwtService.sign({
      sub: user.id,
      walletAddress: user.walletAddress,
    });

    // Clean up used nonce
    this.nonceMap.delete(address.toLowerCase());

    return {
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        authMethod: user.authMethod,
        kycStatus: user.kycStatus,
        bannedUntil: user.bannedUntil,
      },
    };
  }

  async oauthLogin(dto: OAuthLoginDto) {
    let email: string;

    // Validate OAuth token and get email
    if (dto.provider === AuthMethod.GOOGLE) {
      const result = await this.oauthService.validateGoogleToken(
        dto.accessToken,
      );
      email = result.email;
    } else if (dto.provider === AuthMethod.FACEBOOK) {
      const result = await this.oauthService.validateFacebookToken(
        dto.accessToken,
      );
      email = result.email;
    } else {
      throw new UnauthorizedException('Invalid OAuth provider');
    }

    // Find existing user
    let user = await this.userRepository.findOne({
      where: { email, authMethod: dto.provider },
    });

    if (!user) {
      // Create new wallet
      const wallet = ethers.Wallet.createRandom();
      const encryptedPrivateKey = await this.encryptionService.encrypt(
        wallet.privateKey,
      );

      // Create new user
      user = this.userRepository.create({
        walletAddress: wallet.address,
        encryptedPrivateKey,
        authMethod: dto.provider,
        email,
        facebookId: dto.provider === AuthMethod.FACEBOOK ? email : null,
        kycStatus: KycStatus.NONE,
        bannedUntil: null,
      });
      await this.userRepository.save(user);
    }

    // Check if user is banned
    if (user.bannedUntil && user.bannedUntil > new Date()) {
      throw new ForbiddenException(
        `User is banned until ${user.bannedUntil.toISOString()}`,
      );
    }

    // Generate JWT
    const token = this.jwtService.sign({
      sub: user.id,
      walletAddress: user.walletAddress,
    });

    return {
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        authMethod: user.authMethod,
        email: user.email,
        kycStatus: user.kycStatus,
        bannedUntil: user.bannedUntil,
      },
    };
  }
}
