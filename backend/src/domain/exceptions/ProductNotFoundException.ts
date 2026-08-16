import { DomainException } from './DomainException';

export class ProductNotFoundException extends DomainException {
  readonly code = 'PRODUCT_NOT_FOUND';

  constructor(productId: string) {
    super(`Product with id "${productId}" was not found`);
  }
}
