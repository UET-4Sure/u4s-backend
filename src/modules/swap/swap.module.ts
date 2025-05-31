import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pool } from '../pool/entities/pool.entity';
import { Swap } from './entities/swap.entity';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';

@Module({
  imports: [TypeOrmModule.forFeature([Swap, Pool])],
  controllers: [SwapController],
  providers: [SwapService],
  exports: [SwapService],
})
export class SwapModule {}
