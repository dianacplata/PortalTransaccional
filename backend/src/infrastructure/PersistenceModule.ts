import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './persistence/entities/ProductEntity';
import { CustomerEntity } from './persistence/entities/CustomerEntity';
import { TransactionEntity } from './persistence/entities/TransactionEntity';
import { DeliveryEntity } from './persistence/entities/DeliveryEntity';
import { PostgresProductRepository } from './persistence/repositories/PostgresProductRepository';
import { PostgresCustomerRepository } from './persistence/repositories/PostgresCustomerRepository';
import { PostgresTransactionRepository } from './persistence/repositories/PostgresTransactionRepository';
import { PRODUCT_REPOSITORY } from '../domain/ports/IProductRepository';
import { CUSTOMER_REPOSITORY } from '../domain/ports/ICustomerRepository';
import { TRANSACTION_REPOSITORY } from '../domain/ports/ITransactionRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      CustomerEntity,
      TransactionEntity,
      DeliveryEntity,
    ]),
  ],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PostgresProductRepository,
    },
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: PostgresCustomerRepository,
    },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PostgresTransactionRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY, CUSTOMER_REPOSITORY, TRANSACTION_REPOSITORY],
})
export class PersistenceModule {}