import { HttpStatus } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import { DomainExceptionFilter } from './DomainExceptionFilter';
import { ProductNotFoundException } from '../../../domain/exceptions/ProductNotFoundException';
import { InsufficientStockException } from '../../../domain/exceptions/InsufficientStockException';
import { PaymentException } from '../../../domain/exceptions/PaymentException';
import { TransactionNotFoundException } from '../../../domain/exceptions/TransactionNotFoundException';

const makeHost = (response: Record<string, jest.Mock>): ArgumentsHost =>
  ({
    switchToHttp: jest.fn().mockReturnValue({
      getResponse: jest.fn().mockReturnValue(response),
    }),
  }) as unknown as ArgumentsHost;

describe('DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;
  let json:   jest.Mock;
  let status: jest.Mock;
  let host:   ArgumentsHost;

  beforeEach(() => {
    filter = new DomainExceptionFilter();
    json   = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    host   = makeHost({ status });
  });

  it('maps PRODUCT_NOT_FOUND → 404', () => {
    filter.catch(new ProductNotFoundException('uuid-x'), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });

  it('maps INSUFFICIENT_STOCK → 409', () => {
    filter.catch(new InsufficientStockException(2, 5), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
  });

  it('maps PAYMENT_FAILED → 422', () => {
    filter.catch(new PaymentException('declined'), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('maps TRANSACTION_NOT_FOUND → 404', () => {
    filter.catch(new TransactionNotFoundException('tx-id'), host);
    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });
});
