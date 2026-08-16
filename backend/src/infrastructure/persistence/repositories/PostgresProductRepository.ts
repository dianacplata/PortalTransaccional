import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductRepository } from '../../../domain/ports/IProductRepository';
import { Product } from '../../../domain/entities/Product';
import { Money } from '../../../domain/value-objects/Money';
import { ProductEntity } from '../entities/ProductEntity';

@Injectable()
export class PostgresProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const rows = await this.repo.find();
    return rows.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Product | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async save(product: Product): Promise<Product> {
    const saved = await this.repo.save(this.toEntity(product));
    return this.toDomain(saved);
  }

  async decreaseStock(productId: string, quantity: number): Promise<void> {
    await this.repo.decrement({ id: productId }, 'stock', quantity);
  }

  private toDomain(row: ProductEntity): Product {
    return new Product(
      row.id,
      row.name,
      row.description,
      Money.of(row.priceCents),
      row.stock,
      row.imageUrl,
      row.createdAt,
      row.updatedAt,
    );
  }

  private toEntity(product: Product): ProductEntity {
    const e = new ProductEntity();
    e.id = product.id;
    e.name = product.name;
    e.description = product.description;
    e.priceCents = product.price.cents;
    e.stock = product.stock;
    e.imageUrl = product.imageUrl;
    e.createdAt = product.createdAt;
    e.updatedAt = product.updatedAt;
    return e;
  }
}