import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import { validateEnvironment } from './config/environment.validation';
import { HealthController } from './common/health/health.controller';
import { UrlsModule } from './urls/urls.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: Number(configService.getOrThrow<string>('THROTTLE_TTL_SECONDS')) * 1_000,
            limit: Number(configService.getOrThrow<string>('THROTTLE_LIMIT')),
          },
        ],
      }),
    }),
    UrlsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
