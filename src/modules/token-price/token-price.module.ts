import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Token } from '../token/entities/token.entity';

import { TokenPrice } from './entities/token-price.entity';
import { TokenPriceController } from './token-price.controller';
import { TokenPriceService } from './token-price.service';

@Module({
  imports: [TypeOrmModule.forFeature([TokenPrice, Token])],
  controllers: [TokenPriceController],
  providers: [TokenPriceService],
  exports: [TokenPriceService],
})
export class TokenPriceModule {}
