import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './infrastructure/persistence/entities/ProductEntity';
import { CustomerEntity } from './infrastructure/persistence/entities/CustomerEntity';
import { TransactionEntity } from './infrastructure/persistence/entities/TransactionEntity';
import { DeliveryEntity } from './infrastructure/persistence/entities/DeliveryEntity';
import { PersistenceModule } from './infrastructure/PersistenceModule';
import { PayModule } from './infrastructure/PayModule';

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
    PersistenceModule,
    PayModule,
  ],
})
export class AppModule {}