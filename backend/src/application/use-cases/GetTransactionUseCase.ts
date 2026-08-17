import { Inject, Injectable, Logger } from '@nestjs/common';
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../../domain/ports/ITransactionRepository';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/ports/IProductRepository';
import { IPaymentGateway, PAYMENT_GATEWAY } from '../../domain/ports/IPaymentGateway';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionStatus } from '../../domain/value-objects/TransactionStatus';
import { TransactionNotFoundException } from '../../domain/exceptions/TransactionNotFoundException';
import { Result, ok, err } from '../result/Result';

@Injectable()
export class GetTransactionUseCase {
  private readonly logger = new Logger(GetTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(transactionId: string): Promise<Result<Transaction>> {
    const transaction = await this.transactionRepo.findById(transactionId);
    if (!transaction) return err(new TransactionNotFoundException(transactionId));

    // Si está PENDING y ya tiene ID de pago en Wompi, sincronizamos el estado real
    if (
      transaction.status === TransactionStatus.PENDING &&
      transaction.payTransactionId
    ) {
      try {
        const latestStatus = await this.paymentGateway.getTransactionStatus(
          transaction.payTransactionId,
        );

        if (latestStatus !== TransactionStatus.PENDING) {
          transaction.updateStatus(latestStatus);
          await this.transactionRepo.update(transaction);

          // Si Wompi aprobó el pago, descontamos el stock (puede que ProcessPaymentUseCase
          // no lo hiciera porque Wompi devolvió PENDING en el primer intento)
          if (latestStatus === TransactionStatus.APPROVED) {
            try {
              await this.productRepo.decreaseStock(
                transaction.productId,
                transaction.quantity,
              );
            } catch (stockErr) {
              // El stock puede ya haberse descontado en otro path; lo registramos pero no fallamos
              this.logger.warn(`Stock decrease skipped: ${String(stockErr)}`);
            }
          }

          this.logger.log(
            `Transaction ${transactionId} synced: PENDING → ${latestStatus}`,
          );
        }
      } catch (e) {
        // No bloqueamos la respuesta si Wompi falla; devolvemos el estado local
        this.logger.warn(`Could not sync status from gateway: ${String(e)}`);
      }
    }

    return ok(transaction);
  }
}
