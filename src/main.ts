import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import compression from 'compression';
import { RedisStore } from 'connect-redis';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import { createClient } from 'redis';

import { env } from './config';
import { AppModule } from './modules/app.module';

const setMiddleware = async (app: NestExpressApplication) => {
  app.use(helmet());

  // Initialize Redis client
  const redisClient = createClient({
    url: env.redis.url,
  });
  await redisClient.connect();

  // Initialize Redis store
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'u4s:',
  });

  app.use(
    session({
      store: redisStore,
      secret: env.auth.jwt.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: env.app.env === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );

  app.enableCors({
    credentials: true,
    origin: (_, callback) => callback(null, true),
  });

  app.use(morgan('combined'));

  app.use(compression());

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new Logger('[]'),
  });
  app.useLogger(new Logger('[APP]'));
  const logger = new Logger('[APP]');

  app.setGlobalPrefix('api');
  await setMiddleware(app);

  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('U4S Backend API')
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, swaggerDocument, {
      jsonDocumentUrl: 'swagger/json',
    });
  }

  await app.listen(env.app.port, () =>
    logger.warn(`> Listening on port ${env.app.port}`),
  );
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
