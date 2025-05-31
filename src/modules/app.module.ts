import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from 'src/libs/typeORM.config';
import { TokenModule } from './token/token.module';
import { PoolModule } from './pool/pool.module';
import { PositionModule } from './position/position.module';
import { SwapModule } from './swap/swap.module';
import { TokenPriceModule } from './token-price/token-price.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot(dataSource.options),
    TokenModule,
    TokenPriceModule,
    PoolModule,
    PositionModule,
    SwapModule,
  ],
})
export class AppModule {}
