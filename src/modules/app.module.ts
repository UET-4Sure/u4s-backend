import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from 'src/libs/typeORM.config';
import { AuthModule } from './auth/auth.module';
import { PoolMetricsModule } from './pool-metrics/pool-metrics.module';
import { PoolModule } from './pool/pool.module';
import { PositionModule } from './position/position.module';
import { TokenPriceModule } from './token-price/token-price.module';
import { TokenModule } from './token/token.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot(dataSource.options),
    AuthModule,
    UserModule,
    TransactionModule,
    TokenModule,
    TokenPriceModule,
    PoolModule,
    PoolMetricsModule,
    PositionModule,
  ],
})
export class AppModule {}
