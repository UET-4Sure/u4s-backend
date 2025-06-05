import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { AppModule } from 'src/modules/app.module';
import * as request from 'supertest';
import { EncryptionService } from '../src/modules/auth/services/encryption.service';
import { AuthMethod, User } from '../src/modules/user/entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let testWallet: ethers.Wallet;
  let userRepository: any;
  let encryptionService: EncryptionService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get repository and service instances
    userRepository = moduleFixture.get(getRepositoryToken(User));
    encryptionService = moduleFixture.get(EncryptionService);

    // Create a test wallet
    testWallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey);

    // Create test user with encrypted private key
    const encryptedPrivateKey = await encryptionService.encrypt(
      testWallet.privateKey,
    );
    await userRepository.save({
      walletAddress: testWallet.address.toLowerCase(),
      authMethod: AuthMethod.WALLET,
      encryptedPrivateKey,
      kycStatus: 'none',
    });
  });

  afterAll(async () => {
    // Clean up test data
    await userRepository.delete({
      walletAddress: testWallet.address.toLowerCase(),
    });
    await app.close();
  });

  describe('GET /users/private-key', () => {
    it('should get private key successfully', async () => {
      return request(app.getHttpServer())
        .get('/users/private-key')
        .query({ walletAddress: testWallet.address })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('privateKey');
          expect(res.body.privateKey).toBe(testWallet.privateKey);
        });
    });

    it('should return 401 for invalid wallet address', () => {
      return request(app.getHttpServer())
        .get('/users/private-key')
        .query({ walletAddress: '0x1234567890123456789012345678901234567890' })
        .expect(401);
    });

    it('should return 401 for missing wallet address', () => {
      return request(app.getHttpServer()).get('/users/private-key').expect(401);
    });
  });
});
