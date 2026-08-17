import { Money } from './Money';

describe('Money', () => {
  describe('of()', () => {
    it('should create a Money instance with correct cents', () => {
      const m = Money.of(1000);
      expect(m.cents).toBe(1000);
    });

    it('should create a zero-value Money instance', () => {
      expect(Money.of(0).cents).toBe(0);
    });

    it('should throw on negative value', () => {
      expect(() => Money.of(-1)).toThrow('Invalid money amount');
    });

    it('should throw on non-integer (float)', () => {
      expect(() => Money.of(1.5)).toThrow('Invalid money amount');
    });
  });

  describe('add()', () => {
    it('should return the sum of two Money values', () => {
      const a = Money.of(300);
      const b = Money.of(700);
      expect(a.add(b).cents).toBe(1000);
    });
  });

  describe('multiply()', () => {
    it('should return the product', () => {
      expect(Money.of(500).multiply(3).cents).toBe(1500);
    });

    it('should return zero when multiplied by 0', () => {
      expect(Money.of(500).multiply(0).cents).toBe(0);
    });
  });

  describe('equals()', () => {
    it('should return true for the same value', () => {
      expect(Money.of(100).equals(Money.of(100))).toBe(true);
    });

    it('should return false for different values', () => {
      expect(Money.of(100).equals(Money.of(200))).toBe(false);
    });
  });

  describe('format()', () => {
    it('should return a string starting with $', () => {
      expect(Money.of(8_900_000).format()).toMatch(/^\$/);
    });
  });
});
