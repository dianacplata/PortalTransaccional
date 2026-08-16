import { Inject, Injectable } from '@nestjs/common';
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../../domain/ports/ITransactionRepository';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/ports/IProductRepository';
import { IPaymentGateway, PAYMENT_GATEWAY } from '../../domain/ports/IPaymentGateway';
import { TransactionStatus } from '../../domain/value-objects/TransactionStatus';
import { isValidLuhn } from '../../domain/value-objects/CardBrand';
import { TransactionNotFoundException } from '../../domain/exceptions/TransactionNotFoundException';
import { PaymentException } from '../../domain/exceptions/PaymentException';
import { Result, ok, err } from '../result/Result';
import { ProcessPaymentDto } from '../dto/ProcessPaymentDto';

export interface ProcessPaymentResult {
  transactionId: string;
  status: TransactionStatus;
  payTransactionId: string;
  reference: string;
}

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(
    transactionId: string,
    dto: ProcessPaymentDto,
  ): Promise<Result<ProcessPaymentResult>> {
    const transaction = await this.transactionRepo.findById(transactionId);
    if (!transaction) return err(new TransactionNotFoundException(transactionId));

    if (transaction.isCompleted)
      return err(new PaymentException('Transaction is already completed'));

    if (!isValidLuhn(dto.cardNumber))
      return err(new PaymentException('Invalid card number (Luhn check failed)'));

    let cardToken;
    try {
      cardToken = await this.paymentGateway.tokenizeCard({
        number: dto.cardNumber,
        cvc: dto.cvc,
        expMonth: dto.expMonth,
        expYear: dto.expYear,
        cardHolder: dto.cardHolder,
      });
    } catch (e) {
      return err(new PaymentException('Card tokenization failed: ' + String(e)));
    }

    let paymentResult;
    try {
      paymentResult = await this.paymentGateway.createPayment({
        reference: transaction.reference,
        amountInCents: transaction.totalAmount.cents,
        currency: 'COP',
        customerEmail: '',
        cardTokenId: cardToken.id,
        installments: dto.installments,
      });
    } catch (e) {
      return err(new PaymentException('Payment processing failed: ' + String(e)));
    }

    transaction.assignPayId(paymentResult.payTransactionId);
    transaction.updateStatus(paymentResult.status);
    await this.transactionRepo.update(transaction);

    if (paymentResult.status === TransactionStatus.APPROVED) {
      await this.productRepo.decreaseStock(transaction.productId, transaction.quantity);
    }

    return ok({
      transactionId: transaction.id,
      status: transaction.status,
      payTransactionId: paymentResult.payTransactionId,
      reference: transaction.reference,
    });
  }
}