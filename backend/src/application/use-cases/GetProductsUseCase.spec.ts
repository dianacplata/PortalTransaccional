import { GetProductsUseCase } from './GetProductsUseCase';
import { Product } from '../../domain/entities/Product';
import { Money } from '../../domain/value-objects/Money';
import { isOk, isErr } from '../result/Result';
import type { IProductRepository } from '../../domain/ports/IProductRepository';

const makeProduct = () =>
  new Product('uuid-1', 'Test', 'Desc', Money.of(1000), 5, 'img.jpg', new Date(), new Date());

const makeRepo = (overrides: Partial<IProductRepository> = {}): IProductRepository => ({
  findAll:       jest.fn().mockResolvedValue([]),
  findById:      jest.fn(),
  save:          jest.fn(),
  decreaseStock: jest.fn(),
  ...overrides,
});

describe('GetProductsUseCase', () => {
  it('returns all products from the repository', async () => {
    const product = makeProduct();
    const useCase = new GetProductsUseCase(makeRepo({ findAll: jest.fn().mockResolvedValue([product]) }));
    const result  = await useCase.execute();
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.data).toHaveLength(1);
  });

  it('returns an empty array when repository has no products', async () => {
    const useCase = new GetProductsUseCase(makeRepo());
    const result  = await useCase.execute();
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.data).toHaveLength(0);
  });

  it('returns err when the repository throws', async () => {
    const repo    = makeRepo({ findAll: jest.fn().mockRejectedValue(new Error('DB error')) });
    const useCase = new GetProductsUseCase(repo);
    const result  = await useCase.execute();
    expect(isErr(result)).toBe(true);
  });

  it('calls findAll on the repository exactly once', async () => {
    const findAll = jest.fn().mockResolvedValue([]);
    const useCase = new GetProductsUseCase(makeRepo({ findAll }));
    await useCase.execute();
    expect(findAll).toHaveBeenCalledTimes(1);
  });
});
