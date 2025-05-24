import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from 'src/libs/typeORM.config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot(dataSource.options),
  ],
})
export class AppModule {}
