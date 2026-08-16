import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProductEntity } from './infrastructure/persistence/entities/ProductEntity';
import { CustomerEntity } from './infrastructure/persistence/entities/CustomerEntity';
import { TransactionEntity } from './infrastructure/persistence/entities/TransactionEntity';
import { DeliveryEntity } from './infrastructure/persistence/entities/DeliveryEntity';
import { ApiModule } from './infrastructure/http/ApiModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Fix 1: explicit entity array — no glob (glob misses PascalCase filenames)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        url: cfg.get<string>('DATABASE_URL'),
        entities: [ProductEntity, CustomerEntity, TransactionEntity, DeliveryEntity],
        synchronize: cfg.get<string>('NODE_ENV') === 'development',
        logging: cfg.get<string>('NODE_ENV') === 'development',
        ssl: cfg.get<string>('NODE_ENV') === 'production'
          ? { rejectUnauthorized: false }
          : false,
      }),
    }),

    // Global rate limiting: 30 requests per minute
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),

    ApiModule,
  ],
  providers: [
    // Apply ThrottlerGuard globally; individual endpoints can override with @Throttle()
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
