import { GetProductUseCase } from './GetProductUseCase';
import { Product } from '../../domain/entities/Product';
import { Money } from '../../domain/value-objects/Money';
import { ProductNotFoundException } from '../../domain/exceptions/ProductNotFoundException';
import { isOk, isErr } from '../result/Result';
import type { IProductRepository } from '../../domain/ports/IProductRepository';

const makeProduct = (id = 'uuid-1') =>
  new Product(id, 'Test', 'Desc', Money.of(1000), 5, 'img.jpg', new Date(), new Date());

const makeRepo = (product: Product | null): IProductRepository => ({
  findAll:       jest.fn(),
  findById:      jest.fn().mockResolvedValue(product),
  save:          jest.fn(),
  decreaseStock: jest.fn(),
});

describe('GetProductUseCase', () => {
  it('returns the product when it exists', async () => {
    const product = makeProduct();
    const useCase = new GetProductUseCase(makeRepo(product));
    const result  = await useCase.execute('uuid-1');
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.data.id).toBe('uuid-1');
  });

  it('returns ProductNotFoundException when product is not found', async () => {
    const useCase = new GetProductUseCase(makeRepo(null));
    const result  = await useCase.execute('missing-id');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error).toBeInstanceOf(ProductNotFoundException);
  });
});
