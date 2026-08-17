import { Product } from './Product';
import { Money } from '../value-objects/Money';
import { InsufficientStockException } from '../exceptions/InsufficientStockException';

const makeProduct = (stock = 10) =>
  new Product(
    'uuid-1',
    'Test Product',
    'Description',
    Money.of(10_000),
    stock,
    'https://image.url/test.jpg',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  );

describe('Product', () => {
  describe('isAvailable', () => {
    it('returns true when stock > 0', () => {
      expect(makeProduct(5).isAvailable).toBe(true);
    });

    it('returns false when stock is 0', () => {
      expect(makeProduct(0).isAvailable).toBe(false);
    });
  });

  describe('decreaseStock()', () => {
    it('reduces stock by the given quantity', () => {
      const p = makeProduct(10);
      p.decreaseStock(3);
      expect(p.stock).toBe(7);
    });

    it('throws InsufficientStockException when requested > available', () => {
      const p = makeProduct(2);
      expect(() => p.decreaseStock(5)).toThrow(InsufficientStockException);
    });
  });

  describe('totalPrice()', () => {
    it('returns price multiplied by quantity', () => {
      const p = makeProduct(10);
      expect(p.totalPrice(3).cents).toBe(30_000);
    });
  });

  describe('price getter', () => {
    it('returns the product price', () => {
      expect(makeProduct().price.cents).toBe(10_000);
    });
  });
});
