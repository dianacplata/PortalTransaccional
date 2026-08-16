import { DomainException } from './DomainException';

export class InsufficientStockException extends DomainException {
  readonly code = 'INSUFFICIENT_STOCK';

  constructor(available: number, requested: number) {
    super(
      `Insufficient stock: requested ${requested}, but only ${available} available`,
    );
  }
}
