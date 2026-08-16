import { Product } from '../entities/Product';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  decreaseStock(productId: string, quantity: number): Promise<void>;
}
