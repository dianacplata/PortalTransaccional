import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PersistenceModule } from '../PersistenceModule';
import { PayModule } from '../PayModule';
import { ProductsController } from './controllers/ProductsController';
import { TransactionsController } from './controllers/TransactionsController';
import { WebhookController } from './controllers/WebhookController';
import { GetProductsUseCase } from '../../application/use-cases/GetProductsUseCase';
import { GetProductUseCase } from '../../application/use-cases/GetProductUseCase';
import { CreateTransactionUseCase } from '../../application/use-cases/CreateTransactionUseCase';
import { GetTransactionUseCase } from '../../application/use-cases/GetTransactionUseCase';
import { ProcessPaymentUseCase } from '../../application/use-cases/ProcessPaymentUseCase';

@Module({
  imports: [ConfigModule, PersistenceModule, PayModule],
  controllers: [ProductsController, TransactionsController, WebhookController],
  providers: [
    GetProductsUseCase,
    GetProductUseCase,
    GetTransactionUseCase,
    ProcessPaymentUseCase,
    CreateTransactionUseCase,
    {
      provide: 'BASE_FEE_CENTS',
      useFactory: (cfg: ConfigService) =>
        parseInt(cfg.get<string>('BASE_FEE_CENTS') ?? '300000', 10),
      inject: [ConfigService],
    },
    {
      provide: 'DELIVERY_FEE_CENTS',
      useFactory: (cfg: ConfigService) =>
        parseInt(cfg.get<string>('DELIVERY_FEE_CENTS') ?? '150000', 10),
      inject: [ConfigService],
    },
  ],
})
export class ApiModule {}
