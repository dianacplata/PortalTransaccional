import { DomainException } from './DomainException';

export class TransactionNotFoundException extends DomainException {
  readonly code = 'TRANSACTION_NOT_FOUND';

  constructor(transactionId: string) {
    super(`Transaction with id "${transactionId}" was not found`);
  }
}
