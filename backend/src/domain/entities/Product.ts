import { Money } from '../value-objects/Money';
import { InsufficientStockException } from '../exceptions/InsufficientStockException';

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    private readonly _price: Money,
    private _stock: number,
    public readonly imageUrl: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get price(): Money {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  get isAvailable(): boolean {
    return this._stock > 0;
  }

  decreaseStock(quantity: number): void {
    if (this._stock < quantity)
      throw new InsufficientStockException(this._stock, quantity);
    this._stock -= quantity;
  }

  totalPrice(quantity: number): Money {
    return this._price.multiply(quantity);
  }
}
