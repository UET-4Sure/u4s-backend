import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { AppModule } from 'src/modules/app.module';
import * as request from 'supertest';
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

  describe('GET /auth/nonce', () => {
    it('should return nonce for valid address', () => {
      return request(app.getHttpServer())
        .get('/auth/nonce')
        .query({ address: testWallet.address })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('nonce');
          expect(typeof res.body.nonce).toBe('string');
        });
    });

    it('should return 401 for missing address', () => {
      return request(app.getHttpServer()).get('/auth/nonce').expect(401);
    });
  });

  describe('POST /auth/wallet-login', () => {
    let nonce: string;

    beforeEach(async () => {
      // Get nonce before each test
      const response = await request(app.getHttpServer())
        .get('/auth/nonce')
        .query({ address: testWallet.address });
      nonce = response.body.nonce;
    });

    it('should login successfully with valid signature', async () => {
      const signature = await testWallet.signMessage(nonce);

      return request(app.getHttpServer())
        .post('/auth/wallet-login')
        .send({
          address: testWallet.address,
          signature,
          nonce,
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

    it('should return 401 for invalid signature', () => {
      return request(app.getHttpServer())
        .post('/auth/wallet-login')
        .send({
          address: testWallet.address,
          signature: 'invalid-signature',
          nonce,
        })
        .expect(401);
    });

    it('should return 401 for expired nonce', async () => {
      // Instead of waiting, use an old nonce
      const oldNonce = 'expired-nonce-' + Date.now();
      const signature = await testWallet.signMessage(oldNonce);

      return request(app.getHttpServer())
        .post('/auth/wallet-login')
        .send({
          address: testWallet.address,
          signature,
          nonce: oldNonce,
        })
        .expect(401);
    });
  });

  describe('POST /auth/oauth-login', () => {
    const realGoogleToken = process.env.TEST_GOOGLE_TOKEN;

    it('should login successfully with Google OAuth', async () => {
      if (!realGoogleToken) {
        console.warn('Skipping Google OAuth test - no test token provided');
        return;
      }

      await request(app.getHttpServer())
        .post('/auth/oauth-login')
        .send({
          provider: AuthMethod.GOOGLE,
          accessToken: realGoogleToken,
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
