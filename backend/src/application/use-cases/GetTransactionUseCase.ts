import { Inject, Injectable } from '@nestjs/common';
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../../domain/ports/ITransactionRepository';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionNotFoundException } from '../../domain/exceptions/TransactionNotFoundException';
import { Result, ok, err } from '../result/Result';

@Injectable()
export class GetTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: ITransactionRepository,
  ) {}

  async execute(transactionId: string): Promise<Result<Transaction>> {
    const transaction = await this.transactionRepo.findById(transactionId);
    if (!transaction) return err(new TransactionNotFoundException(transactionId));
    return ok(transaction);
  }
}
