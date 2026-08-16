import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/ports/IProductRepository';
import { Product } from '../../domain/entities/Product';
import { ProductNotFoundException } from '../../domain/exceptions/ProductNotFoundException';
import { Result, ok, err } from '../result/Result';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(productId: string): Promise<Result<Product>> {
    const product = await this.productRepo.findById(productId);
    if (!product) return err(new ProductNotFoundException(productId));
    return ok(product);
  }
}
