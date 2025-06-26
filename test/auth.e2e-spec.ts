import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { AppModule } from 'src/modules/app.module';
import request from 'supertest';
import { AuthMethod } from '../src/modules/user/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let testWallet: ethers.Wallet;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a test wallet for wallet login tests
    testWallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/wallet-login', () => {
    const domain = {
      name: 'U4S Auth',
      version: '1',
      chainId: 1,
      verifyingContract: '0x1234567890123456789012345678901234567890',
    };

    const types = {
      Login: [
        { name: 'wallet', type: 'address' },
        { name: 'nonce', type: 'string' },
        { name: 'timestamp', type: 'uint256' },
      ],
    };

    it('should login successfully with valid EIP-712 signature', async () => {
      const nonce = 'test-nonce-' + Date.now();
      const timestamp = Math.floor(Date.now() / 1000);
      
      const message = {
        wallet: testWallet.address,
        nonce,
        timestamp,
      };

      const signature = await testWallet._signTypedData(domain, types, message);

      return request(app.getHttpServer())
        .post('/auth/wallet-login')
        .send({
          address: testWallet.address,
          signature,
          domain,
          types,
          message,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty(
            'walletAddress',
            testWallet.address.toLowerCase(),
          );
          expect(res.body.user).toHaveProperty('authMethod', AuthMethod.WALLET);
        });
    });

    it('should return 401 for invalid signature', async () => {
      const nonce = 'test-nonce-' + Date.now();
      const timestamp = Math.floor(Date.now() / 1000);
      
      const message = {
        wallet: testWallet.address,
        nonce,
        timestamp,
      };

      return request(app.getHttpServer())
        .post('/auth/wallet-login')
        .send({
          address: testWallet.address,
          signature: '0x1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
          domain,
          types,
          message,
        })
        .expect(401);
    });

    it('should return 401 for signature from different wallet', async () => {
      const otherWallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey);
      const nonce = 'test-nonce-' + Date.now();
      const timestamp = Math.floor(Date.now() / 1000);
      
      const message = {
        wallet: testWallet.address, // Using testWallet address but signing with otherWallet
        nonce,
        timestamp,
      };

      const signature = await otherWallet._signTypedData(domain, types, message);

      return request(app.getHttpServer())
        .post('/auth/wallet-login')
        .send({
          address: testWallet.address,
          signature,
          domain,
          types,
          message,
        })
        .expect(401);
    });

    it('should return 401 for mismatched wallet address in message', async () => {
      const nonce = 'test-nonce-' + Date.now();
      const timestamp = Math.floor(Date.now() / 1000);
      
      const message = {
        wallet: '0x1234567890123456789012345678901234567890', // Different address
        nonce,
        timestamp,
      };

      const signature = await testWallet._signTypedData(domain, types, message);

      return request(app.getHttpServer())
        .post('/auth/wallet-login')
        .send({
          address: testWallet.address,
          signature,
          domain,
          types,
          message,
        })
        .expect(401);
    });

    it('should create new user if wallet address not found', async () => {
      const newWallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey);
      const nonce = 'test-nonce-' + Date.now();
      const timestamp = Math.floor(Date.now() / 1000);
      
      const message = {
        wallet: newWallet.address,
        nonce,
        timestamp,
      };

      const signature = await newWallet._signTypedData(domain, types, message);

      return request(app.getHttpServer())
        .post('/auth/wallet-login')
        .send({
          address: newWallet.address,
          signature,
          domain,
          types,
          message,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty(
            'walletAddress',
            newWallet.address.toLowerCase(),
          );
          expect(res.body.user).toHaveProperty('authMethod', AuthMethod.WALLET);
          expect(res.body.user).toHaveProperty('kycStatus', 'none');
        });
    });
  });

  describe('POST /auth/oauth-login', () => {
    it('should login successfully with Google OAuth', async () => {
      // Skip test if no Google token is provided
      if (!process.env.TEST_GOOGLE_TOKEN) {
        console.log('Skipping Google OAuth test - no test token provided');
        return;
      }

      await request(app.getHttpServer())
        .post('/auth/oauth-login')
        .send({
          provider: AuthMethod.GOOGLE,
          accessToken: process.env.TEST_GOOGLE_TOKEN,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('authMethod', AuthMethod.GOOGLE);
          expect(res.body.user).toHaveProperty('email');
        });
    });

    it('should return 401 for invalid OAuth provider', () => {
      return request(app.getHttpServer())
        .post('/auth/oauth-login')
        .send({
          provider: 'invalid-provider',
          accessToken: 'some-token',
        })
        .expect(401);
    });
  });
});
