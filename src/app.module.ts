import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisConfig } from './config/redis.config.js';
import { UserModule } from './users/user.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // for interpolation (using variables in other variables) in my env
      expandVariables: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production'
    }),
    CacheModule.registerAsync({
      isGlobal: true, // Makes cache available throughout the app
      inject: [ConfigService],  
      useFactory: redisConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeormConfig
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
