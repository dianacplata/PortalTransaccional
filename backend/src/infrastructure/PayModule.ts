import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PayClient } from './adapters/pay/PayClient';
import { PayAdapter } from './adapters/pay/PayAdapter';
import { PAYMENT_GATEWAY } from '../domain/ports/IPaymentGateway';

@Module({
  imports: [ConfigModule],
  providers: [
    PayClient,
    {
      provide: PAYMENT_GATEWAY,
      useClass: PayAdapter,
    },
  ],
  exports: [PAYMENT_GATEWAY],
})
export class PayModule {}