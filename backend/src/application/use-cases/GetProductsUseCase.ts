import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/ports/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { Result, ok, err } from '../result/Result';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(): Promise<Result<Product[]>> {
    try {
      const products = await this.productRepo.findAll();
      return ok(products);
    } catch (e) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
