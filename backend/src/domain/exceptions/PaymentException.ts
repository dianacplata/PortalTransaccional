import { DomainException } from './DomainException';

export class PaymentException extends DomainException {
  readonly code = 'PAYMENT_FAILED';

  constructor(reason: string) {
    super(`Payment failed: ${reason}`);
  }
}
